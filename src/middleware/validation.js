import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Validation middleware to handle express-validator results
 */
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return ApiResponse.validationError(res, formattedErrors);
  }
  
  next();
};