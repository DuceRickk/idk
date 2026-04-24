'use strict';

const logger = require('../logger');

// In test mode, rate-limiter state bleeds between test files.
// Pass-through middleware keeps behaviour correct without false 429s in tests.
const noop = (_req, _res, next) => next();

if (process.env.NODE_ENV === 'test') {
  module.exports = { loginLimiter: noop, apiLimiter: noop, heavyLimiter: noop };
} else {
  const rateLimit = require('express-rate-limit');

  function onLimitReached(req) {
    logger.warn({ event: 'rate_limit_exceeded', ip: req.ip, path: req.path });
  }

  /**
   * Login brute-force protection: 5 attempts per IP per 15 minutes.
   * skipSuccessfulRequests=false prevents credential-stuffing via valid/invalid interleaving.
   */
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.ip,
    handler: (req, res) => {
      onLimitReached(req);
      res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  });

  /**
   * General API limiter: 100 req/min per authenticated user (falls back to IP).
   * Keyed by user ID to prevent IP-hopping bypass.
   */
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    keyGenerator: (req) => (req.user ? req.user.id : req.ip),
    handler: (req, res) => {
      onLimitReached(req);
      res.status(429).json({ error: 'Rate limit exceeded. Please slow down.' });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  /**
   * Heavy endpoint limiter: 10 req/min per user.
   * Applied to report/export endpoints to prevent mass data harvesting.
   */
  const heavyLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    keyGenerator: (req) => (req.user ? req.user.id : req.ip),
    handler: (req, res) => {
      onLimitReached(req);
      res.status(429).json({ error: 'Too many requests to this endpoint. Try again shortly.' });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  module.exports = { loginLimiter, apiLimiter, heavyLimiter };
}
