import { SupabaseAdmin } from '../utils/supabaseAdmin.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * Admin-only controllers with full database access
 */

/**
 * Get all users (admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await SupabaseAdmin.getAllUsers();
  
  return ApiResponse.success(res, 'Users retrieved successfully', {
    users: users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }))
  });
});

/**
 * Create user as admin
 */
export const createUserAsAdmin = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role = 'user' } = req.body;
  
  // Hash password
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await SupabaseAdmin.createUser({
    email,
    password_hash: hashedPassword,
    first_name: firstName,
    last_name: lastName,
    role,
    is_active: true
  });
  
  logger.info(`User created by admin: ${email}`);
  
  return ApiResponse.created(res, 'User created successfully', {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active
    }
  });
});

/**
 * Update user as admin
 */
export const updateUserAsAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // Convert camelCase to snake_case for database
  const dbUpdateData = {};
  if (updateData.firstName) dbUpdateData.first_name = updateData.firstName;
  if (updateData.lastName) dbUpdateData.last_name = updateData.lastName;
  if (updateData.role) dbUpdateData.role = updateData.role;
  if (updateData.isActive !== undefined) dbUpdateData.is_active = updateData.isActive;
  if (updateData.email) dbUpdateData.email = updateData.email;
  
  const user = await SupabaseAdmin.updateUser(id, dbUpdateData);
  
  logger.info(`User updated by admin: ${user.email}`);
  
  return ApiResponse.success(res, 'User updated successfully', {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active
    }
  });
});

/**
 * Delete user as admin
 */
export const deleteUserAsAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await SupabaseAdmin.deleteUser(id);
  
  logger.info(`User deleted by admin: ${id}`);
  
  return ApiResponse.success(res, 'User deleted successfully');
});

/**
 * Get all tasks across all users (admin only)
 */
export const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await SupabaseAdmin.getAllTasks();
  
  return ApiResponse.success(res, 'All tasks retrieved successfully', {
    tasks: tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      tags: task.tags,
      user: task.users ? {
        id: task.users.id,
        email: task.users.email,
        name: `${task.users.first_name} ${task.users.last_name}`
      } : null,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    }))
  });
});

/**
 * Get system statistics (admin only)
 */
export const getSystemStats = asyncHandler(async (req, res) => {
  const users = await SupabaseAdmin.getAllUsers();
  const tasks = await SupabaseAdmin.getAllTasks();
  
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length
  };
  
  return ApiResponse.success(res, 'System statistics retrieved successfully', {
    stats
  });
});