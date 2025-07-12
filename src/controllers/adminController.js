import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import supabase from '../config/database.js';

/**
 * Admin user management controllers
 */

/**
 * Get all users with filtering and pagination (admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const filters = {
    role: req.query.role,
    isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
    search: req.query.search,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy || 'created_at',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const result = await User.findWithFilters(filters);
  
  // Get role definitions for reference
  const roleDefinitions = User.getUserRoleDefinitions();
  
  return ApiResponse.success(res, 'Users retrieved successfully', {
    users: result.users.map(user => user.getAdminProfile()),
    pagination: result.pagination,
    roleDefinitions
  });
});

/**
 * Get user by ID (admin only)
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  return ApiResponse.success(res, 'User retrieved successfully', {
    user: user.getAdminProfile()
  });
});

/**
 * Create user as admin
 */
export const createUserAsAdmin = asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    firstName, 
    lastName, 
    role = 'user',
    phoneNumber,
    emergencyContact,
    preferences = {}
  } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return ApiResponse.conflict(res, 'User with this email already exists');
  }
  
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role,
    phoneNumber,
    emergencyContact,
    preferences
  });
  
  logger.info(`User created by admin: ${email}`);
  
  return ApiResponse.created(res, 'User created successfully', {
    user: user.getAdminProfile()
  });
});

/**
 * Update user as admin
 */
export const updateUserAsAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }
  
  // Update user with provided data
  await user.update(req.body);
  
  logger.info(`User updated by admin: ${user.email}`);
  
  return ApiResponse.success(res, 'User updated successfully', {
    user: user.getAdminProfile()
  });
});

/**
 * Delete user as admin
 */
export const deleteUserAsAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  // Prevent deletion of the last admin user
  if (user.role === 'admin') {
    const adminUsers = await User.getUsersByRole('admin');
    if (adminUsers.length <= 1) {
      return ApiResponse.badRequest(res, 'Cannot delete the last admin user');
    }
  }

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  logger.info(`User deleted by admin: ${id}`);
  
  return ApiResponse.success(res, 'User deleted successfully');
});

/**
 * Activate user as admin
 */
export const activateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  await user.activate();
  
  logger.info(`User activated by admin: ${user.email}`);
  
  return ApiResponse.success(res, 'User activated successfully', {
    user: user.getAdminProfile()
  });
});

/**
 * Deactivate user as admin
 */
export const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  // Prevent deactivation of the last admin user
  if (user.role === 'admin') {
    const activeAdminUsers = await User.findWithFilters({ role: 'admin', isActive: true });
    if (activeAdminUsers.users.length <= 1) {
      return ApiResponse.badRequest(res, 'Cannot deactivate the last active admin user');
    }
  }

  await user.deactivate();
  
  logger.info(`User deactivated by admin: ${user.email}`);
  
  return ApiResponse.success(res, 'User deactivated successfully', {
    user: user.getAdminProfile()
  });
});

/**
 * Change user role as admin
 */
export const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  const user = await User.findById(id);
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  // Prevent changing role of the last admin user
  if (user.role === 'admin' && role !== 'admin') {
    const adminUsers = await User.getUsersByRole('admin');
    if (adminUsers.length <= 1) {
      return ApiResponse.badRequest(res, 'Cannot change role of the last admin user');
    }
  }

  await user.changeRole(role);
  
  logger.info(`User role changed by admin: ${user.email} -> ${role}`);
  
  return ApiResponse.success(res, 'User role changed successfully', {
    user: user.getAdminProfile()
  });
});

/**
 * Get user statistics (admin only)
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.getUserStats();
  const roleDefinitions = User.getUserRoleDefinitions();
  
  return ApiResponse.success(res, 'User statistics retrieved successfully', {
    stats,
    roleDefinitions
  });
});

/**
 * Get user roles and permissions (admin only)
 */
export const getRolesAndPermissions = asyncHandler(async (req, res) => {
  const roleDefinitions = User.getUserRoleDefinitions();
  
  return ApiResponse.success(res, 'Roles and permissions retrieved successfully', {
    roles: roleDefinitions
  });
});