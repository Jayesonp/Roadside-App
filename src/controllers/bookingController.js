import { Booking } from '../models/Booking.js';
import { Technician } from '../models/Technician.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import supabase from '../config/database.js';

/**
 * Create a new booking
 */
export const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create(req.body, req.user.id);
  
  logger.info(`Booking created: ${booking.id} by user: ${req.user.id}`);

  // Automatically assign technicians for emergency bookings
  if (req.body.priority === 'emergency') {
    await assignNearestTechnician(booking);
  }
  
  return ApiResponse.created(res, 'Booking created successfully', {
    booking: booking.toJSON()
  });
});

/**
 * Get bookings based on user role
 */
export const getBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    dateFrom,
    dateTo,
    technicianId,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = req.query;

  const options = {
    userId: req.user.id,
    userRole: req.user.role,
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    priority,
    dateFrom,
    dateTo,
    technicianId,
    sortBy,
    sortOrder
  };

  const result = await Booking.findWithFilters(options);
  
  return ApiResponse.success(res, 'Bookings retrieved successfully', {
    bookings: result.bookings.map(booking => booking.toJSON()),
    pagination: result.pagination
  });
});

/**
 * Get a specific booking
 */
export const getBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const booking = await Booking.findById(id, req.user.id);
  
  if (!booking) {
    return ApiResponse.notFound(res, 'Booking not found');
  }
  
  return ApiResponse.success(res, 'Booking retrieved successfully', {
    booking: booking.toJSON()
  });
});

/**
 * Update booking status
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, actualStart, actualCompletion, internalNotes } = req.body;
  
  const booking = await Booking.findById(id, req.user.id);
  
  if (!booking) {
    return ApiResponse.notFound(res, 'Booking not found');
  }

  // Update status
  await booking.updateStatus(status, req.user.id);

  // Update timing if provided
  if (actualStart || actualCompletion || internalNotes) {
    const timingData = {};
    if (actualStart) timingData.actual_start = actualStart;
    if (actualCompletion) timingData.actual_completion = actualCompletion;
    if (internalNotes) timingData.internal_notes = internalNotes;
    
    await booking.updateTiming(timingData);
  }
  
  logger.info(`Booking ${booking.id} status updated to ${status} by user: ${req.user.id}`);
  
  return ApiResponse.success(res, 'Booking status updated successfully', {
    booking: booking.toJSON()
  });
});

/**
 * Assign technician to booking
 */
export const assignTechnician = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { technicianId, estimatedArrival } = req.body;
  
  const booking = await Booking.findById(id);
  
  if (!booking) {
    return ApiResponse.notFound(res, 'Booking not found');
  }

  // Verify technician exists and is available
  const technician = await Technician.findById(technicianId);
  if (!technician) {
    return ApiResponse.notFound(res, 'Technician not found');
  }

  if (!technician.isAvailable || !technician.isOnDuty) {
    return ApiResponse.badRequest(res, 'Technician is not available');
  }

  await booking.assignTechnician(technicianId, estimatedArrival);
  
  logger.info(`Technician ${technicianId} assigned to booking ${booking.id}`);
  
  return ApiResponse.success(res, 'Technician assigned successfully', {
    booking: booking.toJSON()
  });
});

/**
 * Get available technicians for a booking
 */
export const getAvailableTechnicians = asyncHandler(async (req, res) => {
  const { latitude, longitude, serviceTypeId } = req.query;
  
  if (!latitude || !longitude) {
    return ApiResponse.badRequest(res, 'Latitude and longitude are required');
  }

  const technicians = await Booking.getAvailableTechnicians(
    parseFloat(latitude),
    parseFloat(longitude),
    serviceTypeId
  );
  
  return ApiResponse.success(res, 'Available technicians retrieved successfully', {
    technicians
  });
});

/**
 * Get booking analytics
 */
export const getBookingAnalytics = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo } = req.query;
  
  // Default to last 30 days if no dates provided
  const endDate = dateTo ? new Date(dateTo) : new Date();
  const startDate = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const analytics = await Booking.getAnalytics(startDate.toISOString(), endDate.toISOString());
  
  return ApiResponse.success(res, 'Booking analytics retrieved successfully', {
    analytics,
    dateRange: {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    }
  });
});

/**
 * Respond to booking assignment (for technicians)
 */
export const respondToAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { response, estimatedArrival, declineReason } = req.body;
  
  // Get technician profile
  const technician = await Technician.findByUserId(req.user.id);
  if (!technician) {
    return ApiResponse.forbidden(res, 'Not authorized as technician');
  }

  if (response === 'accepted') {
    await technician.acceptBooking(id, estimatedArrival);
    logger.info(`Technician ${technician.id} accepted booking ${id}`);
  } else if (response === 'declined') {
    await technician.declineBooking(id, declineReason);
    logger.info(`Technician ${technician.id} declined booking ${id}: ${declineReason}`);
  }
  
  return ApiResponse.success(res, `Booking assignment ${response} successfully`);
});

/**
 * Start job (technician marks as in progress)
 */
export const startJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const booking = await Booking.findById(id, req.user.id);
  
  if (!booking) {
    return ApiResponse.notFound(res, 'Booking not found');
  }

  await booking.updateTiming({
    actual_start: new Date().toISOString(),
    status: 'in_progress'
  });
  
  logger.info(`Job ${booking.id} started by technician`);
  
  return ApiResponse.success(res, 'Job started successfully', {
    booking: booking.toJSON()
  });
});

/**
 * Complete job
 */
export const completeJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { finalPrice, partsCost, internalNotes, photos } = req.body;
  
  const booking = await Booking.findById(id, req.user.id);
  
  if (!booking) {
    return ApiResponse.notFound(res, 'Booking not found');
  }

  const updateData = {
    actual_completion: new Date().toISOString(),
    status: 'completed'
  };

  if (finalPrice) updateData.final_price = finalPrice;
  if (partsCost) updateData.parts_cost = partsCost;
  if (internalNotes) updateData.internal_notes = internalNotes;
  if (photos) updateData.photos = photos;

  await booking.updateTiming(updateData);
  
  logger.info(`Job ${booking.id} completed`);
  
  return ApiResponse.success(res, 'Job completed successfully', {
    booking: booking.toJSON()
  });
});

/**
 * Cancel booking
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  const booking = await Booking.findById(id, req.user.id);
  
  if (!booking) {
    return ApiResponse.notFound(res, 'Booking not found');
  }

  // Only allow cancellation if not in progress or completed
  if (['in_progress', 'completed'].includes(booking.status)) {
    return ApiResponse.badRequest(res, 'Cannot cancel booking in current status');
  }

  await booking.updateStatus('cancelled', req.user.id);
  
  if (reason) {
    await booking.updateTiming({ internal_notes: `Cancelled: ${reason}` });
  }
  
  logger.info(`Booking ${booking.id} cancelled by user ${req.user.id}`);
  
  return ApiResponse.success(res, 'Booking cancelled successfully');
});

/**
 * Helper function to assign nearest available technician
 */
async function assignNearestTechnician(booking) {
  try {
    const technicians = await Booking.getAvailableTechnicians(
      booking.serviceLatitude,
      booking.serviceLongitude,
      booking.serviceTypeId
    );

    if (technicians.length > 0) {
      // Get the closest available technician
      const nearestTechnician = technicians[0];
      await booking.assignTechnician(nearestTechnician.id);
      
      logger.info(`Auto-assigned technician ${nearestTechnician.id} to emergency booking ${booking.id}`);
    }
  } catch (error) {
    logger.error(`Failed to auto-assign technician for booking ${booking.id}:`, error);
  }
}