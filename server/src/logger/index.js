'use strict';

const { createLogger, format, transports } = require('winston');

const PII_FIELDS = new Set([
  'password', 'token', 'secret', 'authorization',
  'cookie', 'cnpj', 'cpf', 'email', 'refresh_token', 'access_token',
]);

const scrubPII = format((info) => {
  function scrub(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const out = Array.isArray(obj) ? [] : {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = PII_FIELDS.has(k.toLowerCase()) ? '[REDACTED]' : scrub(v);
    }
    return out;
  }
  return Object.assign({}, scrub(info));
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    scrubPII(),
    format.json()
  ),
  transports: [new transports.Console()],
  silent: process.env.NODE_ENV === 'test',
  defaultMeta: { service: 'roadmap-api' },
});

logger.audit = (event, meta = {}) => {
  logger.info({ event, ...meta, audit: true });
};

module.exports = logger;
