#!/usr/bin/env node
'use strict';

/**
 * CI Security Gate — fails the build (exit 1) if any violation is found.
 *
 * Checks performed:
 *  1.  No hardcoded secrets (passwords, tokens, API keys in source).
 *  2.  All /api/* routes apply requireAuth.
 *  3.  No template literals containing SQL keywords (injection risk).
 *  4.  All non-trivial route files have at least one validate() call.
 *  5.  No raw string concatenation building SQL.
 *  6.  Error handler does not leak err.message / err.stack to responses.
 *  7.  Rate limiting (loginLimiter + apiLimiter) is wired up.
 *  8.  Pagination schema used in data-serving routes.
 *  9.  Helmet middleware applied in app.js.
 * 10.  Server binds to configurable host (not hardcoded 0.0.0.0).
 */

const fs   = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

const violations = [];
const results    = [];

function pass(check) {
  results.push({ status: 'PASS', check });
  process.stdout.write(`  \u2713 ${check}\n`);
}

function fail(check, detail) {
  violations.push({ check, detail });
  results.push({ status: 'FAIL', check, detail });
  process.stderr.write(`  \u2717 ${check}: ${detail}\n`);
}

function readFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...readFiles(full));
    } else if (entry.name.endsWith('.js')) {
      out.push({ path: full, rel: path.relative(SRC_DIR, full), content: fs.readFileSync(full, 'utf8') });
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────

function checkHardcodedSecrets(files) {
  process.stdout.write('\n[1] Hardcoded secrets\n');
  const patterns = [
    { re: /(?:password|passwd|secret|api_?key|token)\s*[:=]\s*['"`][^'"`${\s]{6,}['"`]/gi, label: 'hardcoded credential assignment' },
    { re: /Bearer\s+[A-Za-z0-9\-_.]{20,}/g,                                                label: 'hardcoded Bearer token' },
    { re: /eyJ[A-Za-z0-9\-_]{10,}\.eyJ[A-Za-z0-9\-_]{10,}/g,                              label: 'hardcoded JWT value' },
  ];
  let found = false;
  for (const { path: fp, rel, content } of files) {
    for (const { re, label } of patterns) {
      re.lastIndex = 0;
      if (re.test(content)) {
        fail('No hardcoded secrets', `${label} in ${rel}`);
        found = true;
      }
    }
  }
  if (!found) pass('No hardcoded secrets detected');
}

function checkApiRoutesHaveAuth(files) {
  process.stdout.write('\n[2] /api routes protected by requireAuth\n');
  const apiFiles = files.filter((f) => f.path.includes(`routes${path.sep}api`));
  if (!apiFiles.length) {
    fail('API route auth', 'No files found under routes/api/');
    return;
  }
  for (const { rel, content } of apiFiles) {
    const hasImport = content.includes('requireAuth');
    const appliedGlobal = /router\.use\s*\(\s*requireAuth\s*\)/.test(content);
    const appliedInline = /requireAuth\s*,/.test(content);
    if (!hasImport) {
      fail('API route auth', `requireAuth not found in ${rel}`);
    } else if (!appliedGlobal && !appliedInline) {
      fail('API route auth', `requireAuth imported but not applied as middleware in ${rel}`);
    } else {
      pass(`${rel} applies requireAuth`);
    }
  }
}

function checkNoSQLTemplateLiterals(files) {
  process.stdout.write('\n[3] No template literals in SQL\n');
  const sqlKeyword = /\b(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN)\b/i;
  const tplWithInterp = /`[^`]*\$\{[^}]+\}[^`]*`/g;
  let found = false;
  for (const { rel, content } of files) {
    let m;
    tplWithInterp.lastIndex = 0;
    while ((m = tplWithInterp.exec(content)) !== null) {
      if (sqlKeyword.test(m[0])) {
        fail('No SQL template literals', `${rel}: ${m[0].slice(0, 80)}…`);
        found = true;
      }
    }
  }
  if (!found) pass('No template-literal SQL interpolation detected');
}

function checkRouteValidation(files) {
  process.stdout.write('\n[4] Route handlers use validate()\n');
  const routeFiles = files.filter(
    (f) => f.path.includes(`routes${path.sep}`) && !f.rel.includes('health')
  );
  for (const { rel, content } of routeFiles) {
    const routeCount    = (content.match(/router\.(get|post|put|delete|patch)\s*\(/g) || []).length;
    const validateCount = (content.match(/\bvalidate\s*\(/g) || []).length;
    if (routeCount > 0 && validateCount === 0) {
      fail('Route validation', `${rel} has ${routeCount} route(s) but no validate() calls`);
    } else {
      pass(`${rel}: ${routeCount} routes, ${validateCount} validate() call(s)`);
    }
  }
}

function checkNoSQLConcatenation(files) {
  process.stdout.write('\n[5] No SQL string concatenation\n');
  const pattern = /['"`](?:SELECT|INSERT|UPDATE|DELETE)[^;`'"]{0,200}['"`]\s*\+/gi;
  let found = false;
  for (const { rel, content } of files) {
    if (pattern.test(content)) {
      fail('No SQL concatenation', `String-concatenated SQL found in ${rel}`);
      found = true;
    }
    pattern.lastIndex = 0;
  }
  if (!found) pass('No SQL string concatenation detected');
}

function checkErrorHandlerSafety(files) {
  process.stdout.write('\n[6] Error handler does not expose internals\n');
  const handlerFiles = files.filter((f) => f.rel.includes('errorHandler'));
  if (!handlerFiles.length) {
    fail('Error handler safety', 'errorHandler.js not found');
    return;
  }
  for (const { rel, content } of handlerFiles) {
    if (/res\.(?:json|send)\s*\([^)]*err\.\s*(?:message|stack)/.test(content)) {
      fail('Error handler safety', `${rel} may expose err.message or err.stack in response`);
    } else {
      pass(`${rel}: does not forward err.message/stack to client`);
    }
  }
}

function checkRateLimiting(files) {
  process.stdout.write('\n[7] Rate limiting applied\n');
  const authFile = files.find((f) => f.rel === 'routes' + path.sep + 'auth.js');
  const apiFile  = files.find((f) => f.path.includes(`routes${path.sep}api`));

  if (authFile && authFile.content.includes('loginLimiter')) {
    pass('loginLimiter applied to /auth/login');
  } else {
    fail('Rate limiting', 'loginLimiter not applied in auth route');
  }

  if (apiFile && apiFile.content.includes('apiLimiter')) {
    pass('apiLimiter applied to /api router');
  } else {
    fail('Rate limiting', 'apiLimiter not applied in api router');
  }
}

function checkPaginationEnforced(files) {
  process.stdout.write('\n[8] Pagination enforced in data endpoints\n');
  const apiFiles = files.filter((f) => f.path.includes(`routes${path.sep}api`));
  for (const { rel, content } of apiFiles) {
    if (!content.includes('paginationSchema')) {
      fail('Pagination enforcement', `${rel} does not use paginationSchema`);
    } else {
      pass(`${rel} uses paginationSchema`);
    }
  }
}

function checkHelmet(files) {
  process.stdout.write('\n[9] Security headers (Helmet + HSTS)\n');
  const appFile = files.find((f) => f.rel === 'app.js');
  if (!appFile) {
    fail('Security headers', 'app.js not found');
    return;
  }
  if (!appFile.content.includes('helmet')) {
    fail('Security headers', 'Helmet not applied in app.js');
  } else {
    pass('Helmet middleware applied');
  }
  if (!appFile.content.includes('hsts')) {
    fail('Security headers', 'HSTS not configured in Helmet options');
  } else {
    pass('HSTS configured');
  }
}

function checkLocalhostBinding(files) {
  process.stdout.write('\n[10] Server binds to localhost (not 0.0.0.0)\n');
  const indexFile = files.find((f) => f.rel === 'index.js');
  if (!indexFile) {
    fail('Localhost binding', 'src/index.js not found');
    return;
  }
  if (/['"]0\.0\.0\.0['"]/.test(indexFile.content)) {
    fail('Localhost binding', 'Server binds to 0.0.0.0 — must bind to localhost or configurable host');
  } else if (indexFile.content.includes('config.host') || indexFile.content.includes("'127.0.0.1'")) {
    pass('Server binds to config.host (127.0.0.1 by default)');
  } else {
    fail('Localhost binding', 'Cannot confirm server binds to localhost — review src/index.js');
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function main() {
  process.stdout.write('='.repeat(62) + '\n');
  process.stdout.write('  SECURITY CHECK  —  CI/CD Gate\n');
  process.stdout.write('='.repeat(62) + '\n');

  const files = readFiles(SRC_DIR);
  process.stdout.write(`\nScanning ${files.length} source file(s) under ${SRC_DIR}\n`);

  checkHardcodedSecrets(files);
  checkApiRoutesHaveAuth(files);
  checkNoSQLTemplateLiterals(files);
  checkRouteValidation(files);
  checkNoSQLConcatenation(files);
  checkErrorHandlerSafety(files);
  checkRateLimiting(files);
  checkPaginationEnforced(files);
  checkHelmet(files);
  checkLocalhostBinding(files);

  const passed = results.filter((r) => r.status === 'PASS').length;
  process.stdout.write('\n' + '='.repeat(62) + '\n');
  process.stdout.write(`  RESULTS: ${passed} passed, ${violations.length} failed\n`);
  process.stdout.write('='.repeat(62) + '\n');

  if (violations.length > 0) {
    process.stderr.write('\nFAILED CHECKS:\n');
    for (const { check, detail } of violations) {
      process.stderr.write(`  - [${check}] ${detail}\n`);
    }
    process.stderr.write('\nBUILD FAILED: security checks did not pass.\n\n');
    process.exit(1);
  }

  process.stdout.write('\nAll security checks passed.\n\n');
  process.exit(0);
}

main();
