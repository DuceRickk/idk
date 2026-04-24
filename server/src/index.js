'use strict';

const config = require('./config/env');
const logger = require('./logger');
const app = require('./app');

// Bind to localhost (config.host) only — never 0.0.0.0 in production.
// A reverse proxy (Nginx / API Gateway) handles public TLS termination.
const server = app.listen(config.port, config.host, () => {
  logger.info({
    event: 'server_started',
    host: config.host,
    port: config.port,
    nodeEnv: config.nodeEnv,
  });
});

function shutdown(signal) {
  logger.info({ event: 'shutdown_signal', signal });
  server.close(() => {
    logger.info({ event: 'server_stopped' });
    process.exit(0);
  });
  // Force exit if graceful shutdown stalls
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  logger.error({ event: 'uncaught_exception', name: err.name, message: err.message, stack: err.stack });
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error({ event: 'unhandled_rejection', reason: String(reason) });
  process.exit(1);
});

module.exports = server;
