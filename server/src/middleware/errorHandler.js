'use strict';

const logger = require('../logger');

/**
 * Global error handler — must be registered last with four parameters.
 *
 * Logs the full error internally (including stack and message) and returns
 * only a sanitized, non-informative response to the client. This prevents
 * leaking implementation details, DB schemas, file paths, and stack traces.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;

  logger.error({
    event: 'unhandled_error',
    statusCode,
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user && req.user.id,
  });

  if (res.headersSent) return;

  const isClientError = statusCode >= 400 && statusCode < 500;
  res.status(statusCode).json({
    error: isClientError ? (err.publicMessage || 'Request error') : 'Internal server error',
  });
}

/**
 * Application-level error for controlled 4xx/5xx responses.
 * `publicMessage` is shown to the client; everything else stays internal.
 */
class AppError extends Error {
  constructor(publicMessage, statusCode = 500) {
    super(publicMessage);
    this.publicMessage = publicMessage;
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

module.exports = { errorHandler, AppError };
