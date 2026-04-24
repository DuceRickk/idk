'use strict';

const { randomBytes } = require('crypto');
const logger = require('../logger');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';

/**
 * Double-submit cookie CSRF protection for cookie-based JWT auth.
 *
 * On safe methods (GET/HEAD/OPTIONS): issues a fresh csrf_token cookie if absent.
 *   - Cookie is NOT HttpOnly so the SPA JavaScript can read and echo it.
 *   - Cookie is Strict SameSite + Secure in production.
 *
 * On mutating methods (POST/PUT/PATCH/DELETE): validates that
 *   X-CSRF-Token header equals the csrf_token cookie value.
 *
 * An attacker on a cross-origin page cannot read the cookie (SameSite=Strict
 * prevents the browser from sending it in cross-site requests), so the
 * double-submit check holds without a server-side token store.
 */
function csrfMiddleware(req, res, next) {
  if (SAFE_METHODS.has(req.method)) {
    if (!req.cookies[CSRF_COOKIE]) {
      const token = randomBytes(32).toString('hex');
      res.cookie(CSRF_COOKIE, token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600 * 1000,
      });
    }
    return next();
  }

  const cookieToken = req.cookies[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    logger.warn({ event: 'csrf_rejected', ip: req.ip, path: req.path, method: req.method });
    return res.status(403).json({ error: 'CSRF validation failed' });
  }

  next();
}

module.exports = { csrfMiddleware };
