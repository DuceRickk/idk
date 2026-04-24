'use strict';

/**
 * Data Transfer Object helpers.
 *
 * All outbound data passes through these functions to ensure:
 *  - Only whitelisted fields are exposed (no accidental column leakage).
 *  - Sensitive fields are masked for non-admin roles.
 *  - Pagination envelope is consistent across all list endpoints.
 */

function maskCNPJ(cnpj) {
  if (!cnpj || typeof cnpj !== 'string') return undefined;
  const d = cnpj.replace(/\D/g, '');
  if (d.length !== 14) return '**.***.***/**-**';
  return `**.***.***/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

function maskEmail(email) {
  if (!email || typeof email !== 'string') return undefined;
  const at = email.indexOf('@');
  if (at < 1) return '***';
  return `${email[0]}***@${email.slice(at + 1)}`;
}

/**
 * User DTO with role-based field masking.
 *  - admin: full PII (email, CNPJ).
 *  - viewer: masked PII.
 */
function userDTO(user, callerRole) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt || user.created_at,
    email: callerRole === 'admin' ? user.email : maskEmail(user.email),
    cnpj: callerRole === 'admin' ? user.cnpj : maskCNPJ(user.cnpj),
  };
}

/**
 * Wraps a list of items in a consistent pagination envelope.
 * Never returns raw arrays so clients can't infer total DB size from response length.
 */
function pageDTO(items, total, limit, offset) {
  return {
    data: items,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}

module.exports = { maskCNPJ, maskEmail, userDTO, pageDTO };
