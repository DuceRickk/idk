'use strict';

const { z } = require('zod');

const MAX_PAGE_LIMIT = 100;
const MAX_DATE_RANGE_DAYS = 366;

// Whitelist: alphanumerics, spaces, and a narrow set of safe punctuation.
// Rejects: HTML tags, SQL metacharacters (', ", ;, --, /*, */)
const safeString = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-zA-Z0-9 _\-.,:@]+$/, 'Contains disallowed characters');

// Strict ISO date — only YYYY-MM-DD, validated as a real calendar date.
const dateString = z
  .string()
  .regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/, 'Date must be YYYY-MM-DD')
  .refine((v) => !isNaN(Date.parse(v)), 'Invalid calendar date');

// Pagination: coerced from query-string strings; hard cap at MAX_PAGE_LIMIT.
const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_LIMIT).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Date range: both ends required and within allowed window.
const dateRangeSchema = z
  .object({ from: dateString, to: dateString })
  .refine(({ from, to }) => {
    const diff = (new Date(to) - new Date(from)) / 86_400_000;
    return diff >= 0 && diff <= MAX_DATE_RANGE_DAYS;
  }, `Date range must be 0–${MAX_DATE_RANGE_DAYS} days`);

// UUID path parameter.
const idParam = z.object({
  id: z.string().uuid('Invalid ID format'),
});

// Declarative role enum — single source of truth for valid roles.
const roleEnum = z.enum(['admin', 'viewer']);

// Login body: narrow regex prevents SQL/XSS in username.
const loginSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username contains disallowed characters'),
  password: z.string().min(1).max(128),
});

module.exports = {
  safeString,
  dateString,
  paginationSchema,
  dateRangeSchema,
  idParam,
  roleEnum,
  loginSchema,
  MAX_PAGE_LIMIT,
  MAX_DATE_RANGE_DAYS,
};
