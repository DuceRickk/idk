'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('../logger');

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.access_token;

  if (!token) {
    logger.audit('auth_missing_token', { ip: req.ip, path: req.path });
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS256'],
      issuer: 'roadmap-api',
      audience: 'roadmap-client',
    });

    req.user = { id: payload.sub, role: payload.role };
    logger.audit('auth_ok', { userId: payload.sub, path: req.path });
    next();
  } catch (err) {
    logger.audit('auth_failed', { ip: req.ip, path: req.path, reason: err.name });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
