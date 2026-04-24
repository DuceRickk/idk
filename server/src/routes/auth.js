'use strict';

const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const config = require('../config/env');
const logger = require('../logger');
const { loginLimiter } = require('../middleware/rateLimit');
const { validate } = require('../middleware/validate');
const { loginSchema } = require('../schemas/common');

const router = Router();

// ── In-memory refresh token store (swap for Redis in production) ─────────────
// Key: opaque UUID token. Value: { userId, role, expiresAt (unix seconds) }.
const refreshTokenStore = new Map();

// ── In-memory user store (swap for DB in production) ─────────────────────────
const USERS = {
  admin:  { id: '00000000-0000-0000-0000-000000000001', username: 'admin',  role: 'admin' },
  viewer: { id: '00000000-0000-0000-0000-000000000002', username: 'viewer', role: 'viewer' },
};

// Lazy hash lookup — reads from env at call time, never cached in a variable.
const passwordHash = (username) => ({
  admin:  config.auth.adminHash,
  viewer: config.auth.viewerHash,
})[username];

// ── Token helpers ─────────────────────────────────────────────────────────────

function issueTokens(user) {
  const now = Math.floor(Date.now() / 1000);
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role, iat: now },
    config.jwt.secret,
    { algorithm: 'HS256', expiresIn: config.jwt.accessExpiry, issuer: 'roadmap-api', audience: 'roadmap-client' }
  );
  const refreshToken = randomUUID();
  refreshTokenStore.set(refreshToken, {
    userId: user.id,
    role: user.role,
    expiresAt: now + config.jwt.refreshExpiry,
  });
  return { accessToken, refreshToken };
}

function setCookies(res, accessToken, refreshToken) {
  const base = {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'Strict',
    path: '/',
  };
  res.cookie('access_token', accessToken, { ...base, maxAge: config.jwt.accessExpiry * 1000 });
  // Refresh cookie scoped to the refresh endpoint only.
  res.cookie('refresh_token', refreshToken, { ...base, path: '/auth/refresh', maxAge: config.jwt.refreshExpiry * 1000 });
}

function clearCookies(res) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/auth/refresh' });
}

// ── Routes ────────────────────────────────────────────────────────────────────

router.post('/login',
  loginLimiter,
  validate({ body: loginSchema }),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = USERS[username];
      const hash = user && passwordHash(username);

      // Always run bcrypt.compare to prevent timing-based user enumeration.
      const DUMMY_HASH = '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';
      const isValid = await bcrypt.compare(password, hash || DUMMY_HASH) && !!user && !!hash;

      if (!isValid) {
        logger.audit('login_failed', { username, ip: req.ip });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { accessToken, refreshToken } = issueTokens(user);
      setCookies(res, accessToken, refreshToken);
      logger.audit('login_success', { userId: user.id, role: user.role });
      res.json({ message: 'Authenticated' });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.refresh_token;
    if (!token) return res.status(401).json({ error: 'Refresh token required' });

    const stored = refreshTokenStore.get(token);
    if (!stored) {
      logger.audit('refresh_invalid', { ip: req.ip });
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    if (Math.floor(Date.now() / 1000) > stored.expiresAt) {
      refreshTokenStore.delete(token);
      logger.audit('refresh_expired', { userId: stored.userId });
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    // Rotate: old token invalidated, new token issued (prevents replay).
    refreshTokenStore.delete(token);
    const user = Object.values(USERS).find((u) => u.id === stored.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const { accessToken, refreshToken: newRefreshToken } = issueTokens(user);
    setCookies(res, accessToken, newRefreshToken);
    logger.audit('token_refreshed', { userId: user.id });
    res.json({ message: 'Token refreshed' });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  const token = req.cookies && req.cookies.refresh_token;
  if (token) refreshTokenStore.delete(token);
  clearCookies(res);
  logger.audit('logout', { userId: req.user && req.user.id, ip: req.ip });
  res.json({ message: 'Logged out' });
});

// Exposed only for testing — never import in production code.
module.exports = router;
module.exports._refreshTokenStore = refreshTokenStore;
