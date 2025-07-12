import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import supabase from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * JWT Authentication Middleware
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.unauthorized(res, 'Access token required');
  }

  const token = authHeader.substring(7);

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      logger.warn(`Authentication failed for token: ${token.substring(0, 10)}...`);
      return ApiResponse.unauthorized(res, 'Invalid token');
    }

    if (!user.is_active) {
      return ApiResponse.forbidden(res, 'Account is deactivated');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expired');
    }
    
    return ApiResponse.unauthorized(res, 'Invalid token');
  }
});

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    // Allow access if user has one of the required roles
    const hasRequiredRole = roles.includes(req.user.role);
    
    // Special handling for admin role - admins can access everything except where explicitly restricted
    const isAdmin = req.user.role === 'admin';
    const adminRestricted = roles.includes('!admin'); // Use !admin to restrict admin access
    
    if (!hasRequiredRole && !(isAdmin && !adminRestricted)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
      return ApiResponse.forbidden(res, 'Insufficient permissions');
    }

    next();
  };