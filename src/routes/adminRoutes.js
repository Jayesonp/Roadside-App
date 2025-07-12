import express from 'express';
import {
  getAllUsers,
  createUserAsAdmin,
  updateUserAsAdmin,
  deleteUserAsAdmin,
  getAllTasks,
  getSystemStats
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('admin'));

/**
 * Admin user management routes
 */
router.get('/users', getAllUsers);

router.post('/users', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('role').optional().isIn(['user', 'admin'])
], handleValidation, createUserAsAdmin);

router.put('/users/:id', [
  param('id').isUUID(),
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('role').optional().isIn(['user', 'admin']),
  body('isActive').optional().isBoolean()
], handleValidation, updateUserAsAdmin);

router.delete('/users/:id', [
  param('id').isUUID()
], handleValidation, deleteUserAsAdmin);

/**
 * Admin task management routes
 */
router.get('/tasks', getAllTasks);

/**
 * System statistics
 */
router.get('/stats', getSystemStats);

export default router;