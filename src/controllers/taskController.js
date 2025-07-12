import { Task } from '../models/Task.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * Create a new task
 */
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body, req.user.id);
  
  logger.info(`Task created: ${task.id} by user: ${req.user.id}`);
  
  return ApiResponse.created(res, 'Task created successfully', {
    task: task.toJSON()
  });
});

/**
 * Get all tasks for the authenticated user
 */
export const getTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    priority,
    sortBy,
    sortOrder
  };

  const result = await Task.findByUser(req.user.id, options);
  
  return ApiResponse.success(res, 'Tasks retrieved successfully', {
    tasks: result.tasks.map(task => task.toJSON()),
    pagination: result.pagination
  });
});

/**
 * Get a specific task by ID
 */
export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const task = await Task.findByIdAndUser(id, req.user.id);
  
  if (!task) {
    return ApiResponse.notFound(res, 'Task not found');
  }
  
  return ApiResponse.success(res, 'Task retrieved successfully', {
    task: task.toJSON()
  });
});

/**
 * Update a task
 */
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const task = await Task.findByIdAndUser(id, req.user.id);
  
  if (!task) {
    return ApiResponse.notFound(res, 'Task not found');
  }
  
  // Filter out undefined values
  const updateData = {};
  const allowedFields = ['title', 'description', 'status', 'priority', 'due_date', 'tags'];
  
  allowedFields.forEach(field => {
    const bodyField = field === 'due_date' ? 'dueDate' : field;
    if (req.body[bodyField] !== undefined) {
      updateData[field] = req.body[bodyField];
    }
  });
  
  await task.update(updateData);
  
  logger.info(`Task updated: ${task.id} by user: ${req.user.id}`);
  
  return ApiResponse.success(res, 'Task updated successfully', {
    task: task.toJSON()
  });
});

/**
 * Delete a task
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const task = await Task.findByIdAndUser(id, req.user.id);
  
  if (!task) {
    return ApiResponse.notFound(res, 'Task not found');
  }
  
  await task.delete();
  
  logger.info(`Task deleted: ${id} by user: ${req.user.id}`);
  
  return ApiResponse.success(res, 'Task deleted successfully');
});

/**
 * Get task statistics
 */
export const getTaskStats = asyncHandler(async (req, res) => {
  const stats = await Task.getStats(req.user.id);
  
  return ApiResponse.success(res, 'Task statistics retrieved successfully', {
    stats
  });
});