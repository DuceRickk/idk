'use strict';

const { Router } = require('express');

const router = Router();

// Public — no auth, no CSRF, minimal attack surface.
router.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
