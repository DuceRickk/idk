'use strict';

const request = require('supertest');
const app     = require('../src/app');

function loginPost(body) {
  return request(app)
    .post('/auth/login')
    .set('X-CSRF-Token', 'csrf')
    .set('Cookie', 'csrf_token=csrf')
    .send(body);
}

async function adminCookies() {
  const res = await loginPost({ username: 'admin', password: 'AdminPass123!' });
  return (res.headers['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ');
}

// ─────────────────────────────────────────────────────────────────────────────

describe('SQL Injection — login endpoint', () => {
  const payloads = [
    "' OR '1'='1",
    "' OR 1=1--",
    "'; DROP TABLE users;--",
    "admin'--",
    "' UNION SELECT * FROM users--",
    "1; SELECT * FROM information_schema.tables",
    "' OR ''='",
  ];

  for (const payload of payloads) {
    it(`rejects username="${payload.slice(0, 40)}"`, async () => {
      const res = await loginPost({ username: payload, password: 'any' });
      expect([400, 401]).toContain(res.status);
      // Response must not expose stack, sql, or query details
      const body = JSON.stringify(res.body);
      expect(body).not.toMatch(/stack/i);
      expect(body).not.toMatch(/\bsql\b/i);
      expect(body).not.toMatch(/syntax error/i);
    });
  }
});

describe('Auth bypass attacks', () => {
  it('rejects /api/me with no cookie', async () => {
    expect((await request(app).get('/api/me')).status).toBe(401);
  });

  it('rejects /api/me with garbage JWT', async () => {
    expect(
      (await request(app).get('/api/me').set('Cookie', 'access_token=garbage')).status
    ).toBe(401);
  });

  it('rejects /api/me with base64-flipped payload (signature mismatch)', async () => {
    // Valid structure but wrong signature
    const fakeJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIn0.invalidsignature';
    expect(
      (await request(app).get('/api/me').set('Cookie', `access_token=${fakeJwt}`)).status
    ).toBe(401);
  });

  it('rejects /api/me with alg=none attack', async () => {
    // Header: {"alg":"none"}, Payload: {"sub":"1","role":"admin"}
    const noneJwt = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIn0.';
    expect(
      (await request(app).get('/api/me').set('Cookie', `access_token=${noneJwt}`)).status
    ).toBe(401);
  });

  it('rejects viewer accessing admin endpoint (/api/users)', async () => {
    const res = await loginPost({ username: 'viewer', password: 'ViewerPass123!' });
    const cookies = (res.headers['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ');
    expect((await request(app).get('/api/users').set('Cookie', cookies)).status).toBe(403);
  });
});

describe('CSRF protection', () => {
  it('rejects POST /auth/login with no CSRF tokens at all', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'AdminPass123!' });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/CSRF/i);
  });

  it('rejects POST when header token differs from cookie token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .set('X-CSRF-Token', 'token-A')
      .set('Cookie', 'csrf_token=token-B')
      .send({ username: 'admin', password: 'AdminPass123!' });
    expect(res.status).toBe(403);
  });

  it('accepts POST when header and cookie tokens match', async () => {
    const res = await loginPost({ username: 'admin', password: 'AdminPass123!' });
    expect([200, 401]).toContain(res.status); // valid CSRF — outcome depends on credentials
  });
});

describe('Mass data extraction prevention', () => {
  it('caps limit at MAX_PAGE_LIMIT (100) for /api/users', async () => {
    const cookies = await adminCookies();
    const res = await request(app)
      .get('/api/users?limit=99999&offset=0')
      .set('Cookie', cookies);

    if (res.status === 400) {
      // Zod rejected overlimit
      expect(res.body.details).toBeDefined();
    } else {
      expect(res.status).toBe(200);
      expect(res.body.pagination.limit).toBeLessThanOrEqual(100);
    }
  });

  it('applies default pagination when no query params sent', async () => {
    const cookies = await adminCookies();
    const res = await request(app)
      .get('/api/users')
      .set('Cookie', cookies);
    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.limit).toBeLessThanOrEqual(100);
  });

  it('rejects negative offset', async () => {
    const cookies = await adminCookies();
    const res = await request(app)
      .get('/api/users?limit=10&offset=-1')
      .set('Cookie', cookies);
    expect(res.status).toBe(400);
  });

  it('enforces date range for /api/reports (viewer+)', async () => {
    const cookies = await adminCookies();

    // No date range → Zod should reject
    const noRange = await request(app)
      .get('/api/reports')
      .set('Cookie', cookies);
    expect(noRange.status).toBe(400);

    // Range > MAX (> 366 days) → Zod should reject
    const bigRange = await request(app)
      .get('/api/reports?from=2023-01-01&to=2025-01-01&limit=10&offset=0')
      .set('Cookie', cookies);
    expect(bigRange.status).toBe(400);
  });
});

describe('Input validation attacks', () => {
  it('rejects XSS attempt in username', async () => {
    const res = await loginPost({ username: '<script>alert(1)</script>', password: 'x' });
    expect(res.status).toBe(400);
  });

  it('rejects HTML entity injection in username', async () => {
    const res = await loginPost({ username: '&lt;iframe/&gt;', password: 'x' });
    expect(res.status).toBe(400);
  });

  it('rejects oversized username (>64 chars)', async () => {
    const res = await loginPost({ username: 'a'.repeat(65), password: 'x' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid UUID in /api/users/:id', async () => {
    const cookies = await adminCookies();
    const res = await request(app)
      .get('/api/users/not-a-uuid')
      .set('Cookie', cookies);
    expect(res.status).toBe(400);
  });

  it('does not expose stack traces in error responses', async () => {
    const res = await request(app)
      .get('/api/nonexistent-route')
      .set('Cookie', 'access_token=bad');
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/at\s+\w+\s*\(/);  // stack frame pattern
    expect(body).not.toMatch(/\/src\//);
  });
});
