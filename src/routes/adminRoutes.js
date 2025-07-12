import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUserAsAdmin,
  updateUserAsAdmin,
  deleteUserAsAdmin,
  activateUser,
  deactivateUser,
  changeUserRole,
  getUserStats,
  getRolesAndPermissions
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { body, param, query } from 'express-validator';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('admin'));

/**
 * Admin user management routes
 */
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['admin', 'manager', 'technician', 'support', 'user']),
  query('isActive').optional().isBoolean(),
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['created_at', 'updated_at', 'email', 'first_name', 'last_name', 'role']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], handleValidation, getAllUsers);

router.get('/users/:id', [
  param('id').isUUID()
], handleValidation, getUserById);
router.post('/users', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('role').optional().isIn(['admin', 'manager', 'technician', 'support', 'user']),
  body('phoneNumber').optional().isMobilePhone(),
  body('emergencyContact').optional().isString(),
  body('preferences').optional().isObject()
], handleValidation, createUserAsAdmin);

router.put('/users/:id', [
  param('id').isUUID(),
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('role').optional().isIn(['admin', 'manager', 'technician', 'support', 'user']),
  body('isActive').optional().isBoolean(),
  body('phoneNumber').optional().isMobilePhone(),
  body('emergencyContact').optional().isString(),
  body('preferences').optional().isObject()
], handleValidation, updateUserAsAdmin);

router.delete('/users/:id', [
  param('id').isUUID()
], handleValidation, deleteUserAsAdmin);

router.post('/users/:id/activate', [
  param('id').isUUID()
], handleValidation, activateUser);

router.post('/users/:id/deactivate', [
  param('id').isUUID()
], handleValidation, deactivateUser);

router.post('/users/:id/change-role', [
  param('id').isUUID(),
  body('role').isIn(['admin', 'manager', 'technician', 'support', 'user'])
], handleValidation, changeUserRole);
/**
 * Admin statistics and information routes
 */
router.get('/stats/users', getUserStats);

/**
 * Roles and permissions management
 */
router.get('/roles', getRolesAndPermissions);

export default router;