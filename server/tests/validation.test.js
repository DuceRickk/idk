'use strict';

const request       = require('supertest');
const app           = require('../src/app');
const { safeQuery, assertSafe }     = require('../src/db/safeQuery');
const { maskCNPJ, maskEmail, userDTO, pageDTO } = require('../src/dto/sanitize');
const {
  paginationSchema,
  dateString,
  dateRangeSchema,
  loginSchema,
  MAX_PAGE_LIMIT,
  MAX_DATE_RANGE_DAYS,
} = require('../src/schemas/common');

// ─────────────────────────────────────────────────────────────────────────────

describe('Login Zod schema', () => {
  it('accepts valid credentials format', () => {
    expect(() => loginSchema.parse({ username: 'admin_user', password: 'Pass123!' })).not.toThrow();
  });

  it('rejects empty username', () => {
    expect(() => loginSchema.parse({ username: '', password: 'pass' })).toThrow();
  });

  it('rejects username with SQL characters', () => {
    expect(() => loginSchema.parse({ username: "admin'--", password: 'pass' })).toThrow();
  });

  it('rejects username with angle brackets (XSS)', () => {
    expect(() => loginSchema.parse({ username: '<script>', password: 'pass' })).toThrow();
  });

  it('rejects username longer than 64 characters', () => {
    expect(() => loginSchema.parse({ username: 'a'.repeat(65), password: 'pass' })).toThrow();
  });

  it('rejects password longer than 128 characters', () => {
    expect(() => loginSchema.parse({ username: 'user', password: 'p'.repeat(129) })).toThrow();
  });
});

describe('Pagination Zod schema', () => {
  it('coerces query string "20" to number 20', () => {
    const { limit, offset } = paginationSchema.parse({ limit: '20', offset: '0' });
    expect(limit).toBe(20);
    expect(offset).toBe(0);
  });

  it('applies default limit=20 and offset=0 when omitted', () => {
    const { limit, offset } = paginationSchema.parse({});
    expect(limit).toBe(20);
    expect(offset).toBe(0);
  });

  it(`rejects limit > MAX_PAGE_LIMIT (${MAX_PAGE_LIMIT})`, () => {
    expect(() => paginationSchema.parse({ limit: MAX_PAGE_LIMIT + 1, offset: 0 })).toThrow();
  });

  it('rejects limit=0', () => {
    expect(() => paginationSchema.parse({ limit: 0, offset: 0 })).toThrow();
  });

  it('rejects negative offset', () => {
    expect(() => paginationSchema.parse({ limit: 10, offset: -1 })).toThrow();
  });

  it('rejects non-integer limit', () => {
    expect(() => paginationSchema.parse({ limit: 1.5, offset: 0 })).toThrow();
  });
});

describe('Date Zod schema', () => {
  it('accepts YYYY-MM-DD', () => {
    expect(() => dateString.parse('2025-06-15')).not.toThrow();
  });

  it('rejects DD/MM/YYYY format', () => {
    expect(() => dateString.parse('15/06/2025')).toThrow();
  });

  it('rejects month > 12', () => {
    expect(() => dateString.parse('2025-13-01')).toThrow();
  });

  it('rejects day > 31', () => {
    expect(() => dateString.parse('2025-01-32')).toThrow();
  });

  it('rejects ISO datetime (no time allowed)', () => {
    expect(() => dateString.parse('2025-01-15T10:00:00Z')).toThrow();
  });
});

describe('Date range Zod schema', () => {
  it('accepts a valid range within limits', () => {
    expect(() => dateRangeSchema.parse({ from: '2025-01-01', to: '2025-12-31' })).not.toThrow();
  });

  it(`rejects range > ${MAX_DATE_RANGE_DAYS} days`, () => {
    expect(() => dateRangeSchema.parse({ from: '2023-01-01', to: '2025-01-10' })).toThrow();
  });

  it('rejects inverted range (to before from)', () => {
    expect(() => dateRangeSchema.parse({ from: '2025-12-31', to: '2025-01-01' })).toThrow();
  });
});

describe('safeQuery — parameterized query enforcement', () => {
  it('accepts a well-formed parameterized query', async () => {
    await expect(safeQuery('SELECT * FROM users WHERE id = $1', ['uuid-value'])).resolves.toBeDefined();
  });

  it('throws when SQL string contains an unevaluated template placeholder', () => {
    // Simulate source-code pattern: assertSafe sees the literal string before it reaches the DB.
    expect(() => assertSafe('SELECT * FROM users WHERE id = ${userId}')).toThrow(/SECURITY/);
  });

  it('throws on placeholder/param count mismatch (1 placeholder, 0 params)', async () => {
    await expect(safeQuery('SELECT * FROM users WHERE id = $1', [])).rejects.toThrow(/placeholder count/);
  });

  it('throws on placeholder/param count mismatch (0 placeholders, 1 param)', async () => {
    await expect(safeQuery('SELECT 1', ['extra'])).rejects.toThrow(/placeholder count/);
  });

  it('throws when params is not an array', async () => {
    await expect(safeQuery('SELECT * FROM users WHERE id = $1', 'not-array')).rejects.toThrow(/must be an array/);
  });
});

describe('DTO output sanitization', () => {
  const rawUser = {
    id: 'uuid-123',
    username: 'testuser',
    role: 'viewer',
    email: 'user@example.com',
    cnpj: '12345678000190',
    createdAt: '2025-01-01T00:00:00Z',
  };

  describe('maskCNPJ', () => {
    it('masks the first 8 digits, exposes branch+check', () => {
      const masked = maskCNPJ('12.345.678/0001-90');
      expect(masked).toMatch(/\*\*\.\*\*\*\.\*\*\*\/0001-90/);
    });

    it('returns placeholder for null/undefined', () => {
      expect(maskCNPJ(null)).toBeUndefined();
    });
  });

  describe('maskEmail', () => {
    it('shows only first character + domain', () => {
      const m = maskEmail('john.doe@example.com');
      expect(m).toMatch(/^j\*\*\*@example\.com$/);
    });

    it('returns *** for invalid email', () => {
      expect(maskEmail('noemail')).toBe('***');
    });
  });

  describe('userDTO', () => {
    it('exposes full PII to admin caller', () => {
      const dto = userDTO(rawUser, 'admin');
      expect(dto.email).toBe('user@example.com');
      expect(dto.cnpj).toBe('12345678000190');
    });

    it('masks PII for viewer caller', () => {
      const dto = userDTO(rawUser, 'viewer');
      expect(dto.email).not.toBe('user@example.com');
      expect(dto.cnpj).not.toBe('12345678000190');
    });

    it('only exposes whitelisted fields', () => {
      const dto = userDTO({ ...rawUser, password_hash: 'secret', internal_id: 99 }, 'admin');
      expect(dto).not.toHaveProperty('password_hash');
      expect(dto).not.toHaveProperty('internal_id');
    });

    it('returns null for null input', () => {
      expect(userDTO(null, 'admin')).toBeNull();
    });
  });

  describe('pageDTO', () => {
    it('wraps data in pagination envelope', () => {
      const result = pageDTO(['a', 'b'], 50, 20, 0);
      expect(result.data).toEqual(['a', 'b']);
      expect(result.pagination.total).toBe(50);
      expect(result.pagination.hasMore).toBe(true);
    });

    it('sets hasMore=false when last page reached', () => {
      const result = pageDTO(['a'], 21, 20, 20);
      expect(result.pagination.hasMore).toBe(false);
    });
  });
});

describe('HTTP validation — /api/users/:id', () => {
  let cookies;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .set('X-CSRF-Token', 'csrf')
      .set('Cookie', 'csrf_token=csrf')
      .send({ username: 'admin', password: 'AdminPass123!' });
    cookies = (res.headers['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ');
  });

  it('rejects non-UUID id param with 400', async () => {
    const res = await request(app)
      .get('/api/users/not-a-uuid')
      .set('Cookie', cookies);
    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });

  it('accepts a valid UUID id param', async () => {
    const res = await request(app)
      .get('/api/users/00000000-0000-0000-0000-000000000001')
      .set('Cookie', cookies);
    // 200 or 404 depending on stub data — both are correct; never 400 or 500
    expect([200, 404]).toContain(res.status);
  });
});
