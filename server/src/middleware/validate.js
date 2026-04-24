'use strict';

const { ZodError } = require('zod');
const logger = require('../logger');

/**
 * Validation middleware factory using Zod.
 *
 * Accepts an object with optional `body`, `params`, `query` Zod schemas.
 * Replaces the request property with the parsed (type-safe, stripped) value.
 * Returns 400 with field-level errors before any handler logic runs.
 *
 * @param {{ body?: ZodSchema, params?: ZodSchema, query?: ZodSchema }} schemas
 */
function validate(schemas) {
  return (req, res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.warn({
          event: 'validation_failed',
          path: req.path,
          errors: err.errors.map((e) => ({ path: e.path, code: e.code })),
        });
        return res.status(400).json({
          error: 'Validation failed',
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}

module.exports = { validate };
