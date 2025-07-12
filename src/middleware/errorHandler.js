import { ApiResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  }

  // Don't leak error details in production
  if (config.nodeEnv === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  return ApiResponse.error(res, message, statusCode);
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req, res) => {
  return ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};