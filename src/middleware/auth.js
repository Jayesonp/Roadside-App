import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { SupabaseAuth } from '../utils/supabaseAuth.js';
import logger from '../utils/logger.js';

/**
 * Supabase Authentication Middleware
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.unauthorized(res, 'Access token required');
  }

  const accessToken = authHeader.substring(7);

  try {
    // Set the session token for Supabase
    if (global.supabaseClient) {
      await global.supabaseClient.auth.setSession({
        access_token: accessToken,
        refresh_token: '' // Will be handled by client
      });
    }

    // Get current user from Supabase
    const user = await SupabaseAuth.getCurrentUser();

    if (!user) {
      logger.warn(`Authentication failed for token: ${accessToken.substring(0, 10)}...`);
      return ApiResponse.unauthorized(res, 'Invalid token');
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user'
    };
    next();
  } catch (error) {
    logger.error('Supabase auth verification failed:', error.message);
    
    if (error.message.includes('expired')) {
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

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
      return ApiResponse.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};