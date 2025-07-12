import express from 'express';
import authRoutes from './authRoutes.js';
import taskRoutes from './taskRoutes.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return ApiResponse.success(res, 'API is healthy', {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;