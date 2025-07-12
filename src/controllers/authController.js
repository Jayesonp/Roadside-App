import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import { SupabaseAuth } from '../utils/supabaseAuth.js';

/**
 * Register new user
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Register user with Supabase Auth
    const { user, session } = await SupabaseAuth.signUp(email, password, {
      firstName,
      lastName
    });
  }

    logger.info(`New user registered: ${email}`);

    return ApiResponse.created(res, 'User registered successfully', {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name
      },
      session
    });
  } catch (error) {
    if (error.message.includes('User already registered')) {
      return ApiResponse.conflict(res, 'User with this email already exists');
    }
    throw error;
  }
});

/**
 * Login user
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign in with Supabase Auth
    const { user, session } = await SupabaseAuth.signIn(email, password);

    logger.info(`User logged in: ${email}`);

    return ApiResponse.success(res, 'Login successful', {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name
      },
      session
    });
  } catch (error) {
    if (error.message.includes('Invalid login credentials')) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }
    throw error;
  }
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await SupabaseAuth.getCurrentUser();

  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  return ApiResponse.success(res, 'Profile retrieved successfully', {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.first_name,
      lastName: user.user_metadata?.last_name,
      createdAt: user.created_at
    }
  });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;

  const { user } = await SupabaseAuth.updateProfile({
    first_name: firstName,
    last_name: lastName
  });

  logger.info(`User profile updated: ${user.email}`);

  return ApiResponse.success(res, 'Profile updated successfully', {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.first_name,
      lastName: user.user_metadata?.last_name
    }
  });
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req, res) => {
  await SupabaseAuth.signOut();
  logger.info('User logged out');
  return ApiResponse.success(res, 'Logout successful');
});