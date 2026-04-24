'use strict';

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const config = require('./config/env');
const logger = require('./logger');
const { errorHandler } = require('./middleware/errorHandler');
const { csrfMiddleware } = require('./middleware/csrf');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

const app = express();

// ── Proxy trust (must be set before req.ip is used for rate limiting) ────────
if (config.trustProxy) app.set('trust proxy', config.trustProxy);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'"],
      imgSrc:      ["'self'", 'data:'],
      connectSrc:  ["'self'"],
      fontSrc:     ["'self'"],
      objectSrc:   ["'none'"],
      mediaSrc:    ["'none'"],
      frameSrc:    ["'none'"],
    },
  },
  hsts: {
    maxAge: 31_536_000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
}));

// ── Body parsing — hard limit prevents memory exhaustion from large payloads ──
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());

// ── CORS — whitelist-only, credentials=true required for cookie transport ────
const allowedOrigins = new Set(config.allowedOrigins);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-Token');
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── CSRF protection for all cookie-based state-mutating requests ──────────────
app.use(csrfMiddleware);

// ── Structured request logging (no PII in fields) ────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      event: 'http_request',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
    });
  });
  next();
});

// ── Public routes (no auth) ───────────────────────────────────────────────────
app.use('/health', healthRouter);
app.use('/auth', authRouter);

// ── Protected API routes (/api/*) ─────────────────────────────────────────────
// requireAuth is applied as the first middleware inside apiRouter,
// so every route under /api/* is protected — no exceptions.
app.use('/api', apiRouter);

// ── 404 for anything else ────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler — must have exactly 4 params to be recognized ────────
app.use(errorHandler);

module.exports = app;
