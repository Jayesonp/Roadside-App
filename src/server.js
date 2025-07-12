import app from './app.js';
import { config } from './config/index.js';
import logger from './utils/logger.js';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (error) {
  // Directory already exists
}

// Serve static files from root directory (for the frontend)
app.use(express.static(join(__dirname, '..')));

// Serve index.html for frontend routes (SPA support)
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'index.html'));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(config.port, () => {
  logger.info(`🚀 Server running on port ${config.port}`);
  logger.info(`🎨 Frontend: http://localhost:${config.port}`);
  logger.info(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
  logger.info(`🏥 Health Check: http://localhost:${config.port}/api/${config.api.version}/health`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));