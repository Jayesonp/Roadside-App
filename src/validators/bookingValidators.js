import { body, param } from 'express-validator';

export const createBookingValidation = [
  body('serviceTypeId')
    .isUUID()
    .withMessage('Service type ID must be a valid UUID'),
  
  body('customerName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  
  body('customerPhone')
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Customer phone must be a valid phone number'),
  
  body('customerEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Customer email must be valid'),
  
  body('serviceAddress')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Service address must be between 5 and 500 characters'),
  
  body('serviceLatitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Service latitude must be between -90 and 90'),
  
  body('serviceLongitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Service longitude must be between -180 and 180'),
  
  body('preferredDate')
    .optional()
    .isISO8601()
    .withMessage('Preferred date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Preferred date cannot be in the past');
      }
      return true;
    }),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('specialRequirements')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special requirements cannot exceed 500 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'emergency'])
    .withMessage('Priority must be low, normal, high, or emergency')
];

export const updateBookingStatusValidation = [
  param('id')
    .isUUID()
    .withMessage('Booking ID must be a valid UUID'),
  
  body('status')
    .isIn(['pending', 'confirmed', 'technician_assigned', 'technician_en_route', 'in_progress', 'completed', 'cancelled', 'payment_pending', 'paid'])
    .withMessage('Invalid status value'),
  
  body('actualStart')
    .optional()
    .isISO8601()
    .withMessage('Actual start must be a valid ISO 8601 date'),
  
  body('actualCompletion')
    .optional()
    .isISO8601()
    .withMessage('Actual completion must be a valid ISO 8601 date'),
  
  body('internalNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Internal notes cannot exceed 1000 characters')
];

export const assignTechnicianValidation = [
  param('id')
    .isUUID()
    .withMessage('Booking ID must be a valid UUID'),
  
  body('technicianId')
    .isUUID()
    .withMessage('Technician ID must be a valid UUID'),
  
  body('estimatedArrival')
    .optional()
    .isISO8601()
    .withMessage('Estimated arrival must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Estimated arrival cannot be in the past');
      }
      return true;
    })
];

export const respondToAssignmentValidation = [
  param('id')
    .isUUID()
    .withMessage('Booking ID must be a valid UUID'),
  
  body('response')
    .isIn(['accepted', 'declined'])
    .withMessage('Response must be accepted or declined'),
  
  body('estimatedArrival')
    .if(body('response').equals('accepted'))
    .notEmpty()
    .isISO8601()
    .withMessage('Estimated arrival is required when accepting and must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Estimated arrival cannot be in the past');
      }
      return true;
    }),
  
  body('declineReason')
    .if(body('response').equals('declined'))
    .notEmpty()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Decline reason is required when declining and must be between 3 and 200 characters')
];