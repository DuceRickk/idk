'use strict';

const REQUIRED = [
  'JWT_SECRET',
  'ADMIN_PASSWORD_HASH',
  'VIEWER_PASSWORD_HASH',
];

for (const key of REQUIRED) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const jwtSecret = process.env.JWT_SECRET;
if (Buffer.byteLength(jwtSecret, 'utf8') < 32) {
  throw new Error('JWT_SECRET must be at least 32 bytes (256 bits)');
}

module.exports = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '127.0.0.1',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  trustProxy: parseInt(process.env.TRUST_PROXY || '0', 10),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
  jwt: {
    secret: jwtSecret,
    accessExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY || '900', 10),
    refreshExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY || '604800', 10),
  },
  auth: {
    adminHash: process.env.ADMIN_PASSWORD_HASH,
    viewerHash: process.env.VIEWER_PASSWORD_HASH,
  },
};
