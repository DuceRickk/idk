'use strict';

const logger = require('../logger');

// Admin inherits all viewer permissions; extend as roles grow.
const ROLE_HIERARCHY = {
  admin: new Set(['admin', 'viewer']),
  viewer: new Set(['viewer']),
};

/**
 * Declarative RBAC guard.
 * Usage: router.get('/resource', requireAuth, requireRole('admin'), handler)
 *
 * No inline role checks anywhere else in the codebase — all access decisions
 * must go through this factory.
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const permissions = ROLE_HIERARCHY[req.user.role] || new Set();
    const granted = allowedRoles.some((r) => permissions.has(r));

    if (!granted) {
      logger.audit('rbac_denied', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path,
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

module.exports = { requireRole };
