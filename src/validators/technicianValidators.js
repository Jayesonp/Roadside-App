import { body, param } from 'express-validator';

export const updateLocationValidation = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  body('accuracy')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Accuracy must be a positive number'),
  
  body('heading')
    .optional()
    .isFloat({ min: 0, max: 360 })
    .withMessage('Heading must be between 0 and 360 degrees'),
  
  body('speed')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Speed must be a positive number')
];

export const updateAvailabilityValidation = [
  body('isAvailable')
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  
  body('isOnDuty')
    .optional()
    .isBoolean()
    .withMessage('isOnDuty must be a boolean')
];

export const createTechnicianValidation = [
  body('userId')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  
  body('employeeId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee ID must be between 3 and 20 characters')
    .matches(/^[A-Za-z0-9-_]+$/)
    .withMessage('Employee ID can only contain letters, numbers, hyphens, and underscores'),
  
  body('specializations')
    .optional()
    .isArray()
    .withMessage('Specializations must be an array')
    .custom((specializations) => {
      const validSpecializations = ['towing', 'battery', 'tires', 'lockout', 'fuel', 'winch', 'brake_repair', 'engine_repair'];
      const invalid = specializations.filter(spec => !validSpecializations.includes(spec));
      if (invalid.length > 0) {
        throw new Error(`Invalid specializations: ${invalid.join(', ')}`);
      }
      return true;
    }),
  
  body('certificationLevel')
    .optional()
    .isIn(['basic', 'intermediate', 'advanced', 'expert'])
    .withMessage('Certification level must be basic, intermediate, advanced, or expert'),
  
  body('hourlyRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Hourly rate must be a positive number'),
  
  body('serviceRadiusKm')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('Service radius must be between 1 and 200 kilometers'),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Phone must be a valid phone number'),
  
  body('vehicleInfo')
    .optional()
    .isObject()
    .withMessage('Vehicle info must be an object'),
  
  body('emergencyCertified')
    .optional()
    .isBoolean()
    .withMessage('Emergency certified must be a boolean')
];