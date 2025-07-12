import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
import supabase from '../config/database.js';

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

/**
 * Register new user
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return ApiResponse.conflict(res, 'User with this email already exists');
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName
  });

  // Generate token
  const token = generateToken(user.id);

  logger.info(`New user registered: ${email}`);

  return ApiResponse.created(res, 'User registered successfully', {
    user: user.getProfile(),
    token
  });
});

/**
 * Login user
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !userData) {
    return ApiResponse.unauthorized(res, 'Invalid email or password');
  }

  // Verify password
  const isValidPassword = await User.verifyPassword(password, userData.password_hash);
  if (!isValidPassword) {
    return ApiResponse.unauthorized(res, 'Invalid email or password');
  }

  // Check if user is active
  if (!userData.is_active) {
    return ApiResponse.forbidden(res, 'Account is deactivated');
  }

  const user = new User(userData);
  const token = generateToken(user.id);

  logger.info(`User logged in: ${email}`);

  return ApiResponse.success(res, 'Login successful', {
    user: user.getProfile(),
    token
  });
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  return ApiResponse.success(res, 'Profile retrieved successfully', {
    user: user.getProfile()
  });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  
  const user = await User.findById(req.user.id);
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  await user.update({
    first_name: firstName,
    last_name: lastName,
    updated_at: new Date().toISOString()
  });

  logger.info(`User profile updated: ${user.email}`);

  return ApiResponse.success(res, 'Profile updated successfully', {
    user: user.getProfile()
  });
});

/**
 * Logout user (client-side token removal)
 */
export const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // Here we just log the action and return success
  logger.info(`User logged out: ${req.user.email}`);
  
  return ApiResponse.success(res, 'Logout successful');
});