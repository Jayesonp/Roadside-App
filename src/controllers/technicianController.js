import { Technician } from '../models/Technician.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * Get technician profile
 */
export const getTechnicianProfile = asyncHandler(async (req, res) => {
  const technician = await Technician.findByUserId(req.user.id);
  
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician profile not found');
  }

  return ApiResponse.success(res, 'Technician profile retrieved successfully', {
    technician: technician.toJSON()
  });
});

/**
 * Update technician profile
 */
export const updateTechnicianProfile = asyncHandler(async (req, res) => {
  const technician = await Technician.findByUserId(req.user.id);
  
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician profile not found');
  }

  const {
    specializations,
    certificationLevel,
    hourlyRate,
    serviceRadiusKm,
    phone,
    vehicleInfo,
    emergencyCertified
  } = req.body;

  const updateData = {};
  if (specializations) updateData.specializations = specializations;
  if (certificationLevel) updateData.certification_level = certificationLevel;
  if (hourlyRate) updateData.hourly_rate = hourlyRate;
  if (serviceRadiusKm) updateData.service_radius_km = serviceRadiusKm;
  if (phone) updateData.phone = phone;
  if (vehicleInfo) updateData.vehicle_info = vehicleInfo;
  if (emergencyCertified !== undefined) updateData.emergency_certified = emergencyCertified;

  await technician.update(updateData);

  logger.info(`Technician profile updated: ${technician.id}`);

  return ApiResponse.success(res, 'Technician profile updated successfully', {
    technician: technician.toJSON()
  });
});

/**
 * Update technician location
 */
export const updateLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, accuracy, heading, speed } = req.body;
  
  const technician = await Technician.findByUserId(req.user.id);
  
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician profile not found');
  }

  await technician.updateLocation(latitude, longitude, accuracy, heading, speed);

  return ApiResponse.success(res, 'Location updated successfully');
});

/**
 * Update availability status
 */
export const updateAvailability = asyncHandler(async (req, res) => {
  const { isAvailable, isOnDuty } = req.body;
  
  const technician = await Technician.findByUserId(req.user.id);
  
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician profile not found');
  }

  await technician.updateAvailability(isAvailable, isOnDuty);

  logger.info(`Technician ${technician.id} availability updated: available=${isAvailable}, on_duty=${isOnDuty}`);

  return ApiResponse.success(res, 'Availability updated successfully', {
    technician: technician.toJSON()
  });
});

/**
 * Get current bookings for technician
 */
export const getCurrentBookings = asyncHandler(async (req, res) => {
  const technician = await Technician.findByUserId(req.user.id);
  
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician profile not found');
  }

  const bookings = await technician.getCurrentBookings();

  return ApiResponse.success(res, 'Current bookings retrieved successfully', {
    bookings
  });
});

/**
 * Get technician performance statistics
 */
export const getPerformanceStats = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo } = req.query;
  
  const technician = await Technician.findByUserId(req.user.id);
  
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician profile not found');
  }

  // Default to last 30 days if no dates provided
  const endDate = dateTo ? new Date(dateTo) : new Date();
  const startDate = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const stats = await technician.getPerformanceStats(startDate.toISOString(), endDate.toISOString());

  return ApiResponse.success(res, 'Performance statistics retrieved successfully', {
    stats,
    dateRange: {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    }
  });
});

/**
 * Get all technicians (admin only)
 */
export const getAllTechnicians = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    isAvailable,
    isOnDuty,
    certificationLevel,
    specialization,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
    isOnDuty: isOnDuty !== undefined ? isOnDuty === 'true' : undefined,
    certificationLevel,
    specialization,
    sortBy,
    sortOrder
  };

  const result = await Technician.findWithFilters(options);
  
  return ApiResponse.success(res, 'Technicians retrieved successfully', {
    technicians: result.technicians.map(tech => tech.toJSON()),
    pagination: result.pagination
  });
});

/**
 * Get nearby technicians
 */
export const getNearbyTechnicians = asyncHandler(async (req, res) => {
  const { latitude, longitude, maxDistance = 50 } = req.query;
  
  if (!latitude || !longitude) {
    return ApiResponse.badRequest(res, 'Latitude and longitude are required');
  }

  const technicians = await Technician.findNearby(
    parseFloat(latitude),
    parseFloat(longitude),
    parseInt(maxDistance)
  );
  
  return ApiResponse.success(res, 'Nearby technicians retrieved successfully', {
    technicians: technicians.map(tech => tech.toJSON())
  });
});

/**
 * Create technician profile (admin only)
 */
export const createTechnicianProfile = asyncHandler(async (req, res) => {
  const { userId, ...technicianData } = req.body;
  
  // Check if technician profile already exists for this user
  const existingTechnician = await Technician.findByUserId(userId);
  if (existingTechnician) {
    return ApiResponse.conflict(res, 'Technician profile already exists for this user');
  }

  const technician = await Technician.create(technicianData, userId);
  
  logger.info(`Technician profile created: ${technician.id} for user: ${userId}`);

  return ApiResponse.created(res, 'Technician profile created successfully', {
    technician: technician.toJSON()
  });
});

/**
 * Get technician by ID (admin only)
 */
export const getTechnicianById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const technician = await Technician.findById(id);
  
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician not found');
  }

  return ApiResponse.success(res, 'Technician retrieved successfully', {
    technician: technician.toJSON()
  });
});

/**
 * Update technician by ID (admin only)
 */
export const updateTechnicianById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const technician = await Technician.findById(id);
  
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician not found');
  }

  await technician.update(req.body);

  logger.info(`Technician ${technician.id} updated by admin`);

  return ApiResponse.success(res, 'Technician updated successfully', {
    technician: technician.toJSON()
  });
});