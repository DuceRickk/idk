'use strict';

const logger = require('../logger');

// Patterns that indicate unsafe dynamic SQL construction in source code
const UNSAFE_PATTERNS = [
  /\$\{[^}]+\}/,        // Unevaluated template literal placeholder
  /['"`]\s*\+\s*\w+/,   // String concatenation (prefix): '... ' + var
  /\w+\s*\+\s*['"`]/,   // String concatenation (suffix): var + '...'
];

function assertSafe(sql) {
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(sql)) {
      const msg = 'SECURITY: Dynamic SQL construction detected — use parameterized queries ($1, $2, ...)';
      logger.error({ event: 'unsafe_query_detected', fragment: sql.substring(0, 120) });
      throw new Error(msg);
    }
  }
}

/**
 * Execute a parameterized query safely.
 *
 * Rules enforced at call time:
 *  1. SQL string must not contain template-literal or concatenation patterns.
 *  2. params must be an Array.
 *  3. $N placeholder count must equal params.length.
 *
 * @param {string}   sql      - SQL with $1, $2 … positional placeholders only.
 * @param {Array}    params   - Bound parameter values (never interpolated into sql).
 * @param {object}  [client]  - DB client with .query(sql, params) interface (e.g. node-postgres).
 */
async function safeQuery(sql, params = [], client = null) {
  assertSafe(sql);

  if (!Array.isArray(params)) {
    throw new TypeError('safeQuery: params must be an array');
  }

  const placeholders = (sql.match(/\$\d+/g) || []).length;
  if (placeholders !== params.length) {
    throw new Error(
      `safeQuery: placeholder count (${placeholders}) does not match param count (${params.length})`
    );
  }

  logger.debug({ event: 'db_query', placeholders, paramCount: params.length });

  if (client) {
    return client.query(sql, params);
  }

  // Stub — swap for real DB pool in production
  return { rows: [], rowCount: 0 };
}

module.exports = { safeQuery, assertSafe };
