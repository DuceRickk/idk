'use strict';

const { Router } = require('express');
const { z } = require('zod');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const { validate } = require('../../middleware/validate');
const { apiLimiter, heavyLimiter } = require('../../middleware/rateLimit');
const { safeQuery } = require('../../db/safeQuery');
const { userDTO, pageDTO } = require('../../dto/sanitize');
const { paginationSchema, dateRangeSchema, idParam } = require('../../schemas/common');
const logger = require('../../logger');

const router = Router();

// ── Global guards for ALL /api/* routes ──────────────────────────────────────
// requireAuth runs first: any unauthenticated request is rejected with 401.
// apiLimiter runs second: authenticated but rate-exceeded gets 429.
router.use(requireAuth);
router.use(apiLimiter);

// ── GET /api/me — any authenticated role ─────────────────────────────────────
router.get('/me', (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
});

// ── GET /api/users — admin only, paginated ───────────────────────────────────
router.get('/users',
  requireRole('admin'),
  validate({ query: paginationSchema }),
  async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const result = await safeQuery(
        'SELECT id, username, role, email, cnpj, created_at FROM users LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      const users = result.rows.map((u) => userDTO(u, req.user.role));
      logger.audit('data_access', { userId: req.user.id, resource: 'users', limit, offset });
      res.json(pageDTO(users, result.rowCount, limit, offset));
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/users/:id — admin only ──────────────────────────────────────────
router.get('/users/:id',
  requireRole('admin'),
  validate({ params: idParam }),
  async (req, res, next) => {
    try {
      const result = await safeQuery(
        'SELECT id, username, role, email, cnpj, created_at FROM users WHERE id = $1',
        [req.params.id]
      );
      if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
      res.json(userDTO(result.rows[0], req.user.role));
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/reports — viewer+, paginated + date range, heavy limiter ─────────
// dateRangeSchema uses .refine() (ZodEffects) which isn't mergeable — inline the fields.
const reportQuerySchema = paginationSchema
  .merge(z.object({
    from: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/).refine((v) => !isNaN(Date.parse(v))),
    to:   z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/).refine((v) => !isNaN(Date.parse(v))),
    type: z.enum(['summary', 'detail']).default('summary'),
  }))
  .refine(({ from, to }) => {
    const diff = (new Date(to) - new Date(from)) / 86_400_000;
    return diff >= 0 && diff <= 366;
  }, 'Date range must be 0–366 days');

router.get('/reports',
  requireRole('viewer'),
  heavyLimiter,
  validate({ query: reportQuerySchema }),
  async (req, res, next) => {
    try {
      const { limit, offset, from, to } = req.query;
      const result = await safeQuery(
        'SELECT id, type, created_at, summary FROM reports WHERE created_at BETWEEN $1 AND $2 LIMIT $3 OFFSET $4',
        [from, to, limit, offset]
      );
      logger.audit('data_access', { userId: req.user.id, resource: 'reports', from, to, limit, offset });
      res.json(pageDTO(result.rows, result.rowCount, limit, offset));
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
