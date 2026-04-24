'use strict';

// Must run before any module that reads process.env (setupFiles executes first).
process.env.NODE_ENV           = 'test';
process.env.PORT               = '0';
process.env.HOST               = '127.0.0.1';
process.env.TRUST_PROXY        = '0';
process.env.ALLOWED_ORIGINS    = 'http://localhost:5173';
process.env.JWT_ACCESS_EXPIRY  = '900';
process.env.JWT_REFRESH_EXPIRY = '604800';

// 32-byte test secret (never used outside test environment)
process.env.JWT_SECRET = 'test-jwt-secret-that-is-exactly-32-bytes!!';

// Pre-computed bcrypt hashes for test credentials (cost=10 for speed)
const bcrypt = require('bcryptjs');
process.env.ADMIN_PASSWORD_HASH  = bcrypt.hashSync('AdminPass123!',  10);
process.env.VIEWER_PASSWORD_HASH = bcrypt.hashSync('ViewerPass123!', 10);
