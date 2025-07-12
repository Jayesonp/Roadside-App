import express from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  assignTechnician,
  getAvailableTechnicians,
  getBookingAnalytics,
  respondToAssignment,
  startJob,
  completeJob,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import {
  createBookingValidation,
  updateBookingStatusValidation,
  assignTechnicianValidation,
  respondToAssignmentValidation
} from '../validators/bookingValidators.js';

const router = express.Router();

// Apply authentication to all booking routes
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - serviceTypeId
 *         - customerName
 *         - customerPhone
 *         - serviceAddress
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         serviceTypeId:
 *           type: string
 *           format: uuid
 *         customerName:
 *           type: string
 *         customerPhone:
 *           type: string
 *         customerEmail:
 *           type: string
 *         serviceAddress:
 *           type: string
 *         serviceLatitude:
 *           type: number
 *         serviceLongitude:
 *           type: number
 *         preferredDate:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         specialRequirements:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [low, normal, high, emergency]
 *         status:
 *           type: string
 *           enum: [pending, confirmed, technician_assigned, technician_en_route, in_progress, completed, cancelled]
 */

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceTypeId
 *               - customerName
 *               - customerPhone
 *               - serviceAddress
 *             properties:
 *               serviceTypeId:
 *                 type: string
 *                 format: uuid
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *               serviceAddress:
 *                 type: string
 *               serviceLatitude:
 *                 type: number
 *               serviceLongitude:
 *                 type: number
 *               preferredDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               specialRequirements:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, emergency]
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', createBookingValidation, handleValidation, createBooking);

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Get bookings based on user role
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 */
router.get('/', getBookings);

/**
 * @swagger
 * /api/v1/bookings/analytics:
 *   get:
 *     summary: Get booking analytics (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */
router.get('/analytics', authorize('admin'), getBookingAnalytics);

/**
 * @swagger
 * /api/v1/bookings/available-technicians:
 *   get:
 *     summary: Get available technicians for a location
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: serviceTypeId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Available technicians retrieved
 */
router.get('/available-technicians', getAvailableTechnicians);

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   get:
 *     summary: Get a specific booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       404:
 *         description: Booking not found
 */
router.get('/:id', getBooking);

/**
 * @swagger
 * /api/v1/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *               actualStart:
 *                 type: string
 *                 format: date-time
 *               actualCompletion:
 *                 type: string
 *                 format: date-time
 *               internalNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/:id/status', updateBookingStatusValidation, handleValidation, updateBookingStatus);

/**
 * @swagger
 * /api/v1/bookings/{id}/assign:
 *   put:
 *     summary: Assign technician to booking (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicianId
 *             properties:
 *               technicianId:
 *                 type: string
 *                 format: uuid
 *               estimatedArrival:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Technician assigned successfully
 */
router.put('/:id/assign', authorize('admin'), assignTechnicianValidation, handleValidation, assignTechnician);

/**
 * @swagger
 * /api/v1/bookings/{id}/respond:
 *   put:
 *     summary: Respond to booking assignment (technician only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *                 enum: [accepted, declined]
 *               estimatedArrival:
 *                 type: string
 *                 format: date-time
 *               declineReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Response recorded successfully
 */
router.put('/:id/respond', respondToAssignmentValidation, handleValidation, respondToAssignment);

/**
 * @swagger
 * /api/v1/bookings/{id}/start:
 *   put:
 *     summary: Start job (technician)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job started successfully
 */
router.put('/:id/start', startJob);

/**
 * @swagger
 * /api/v1/bookings/{id}/complete:
 *   put:
 *     summary: Complete job (technician)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               finalPrice:
 *                 type: number
 *               partsCost:
 *                 type: number
 *               internalNotes:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Job completed successfully
 */
router.put('/:id/complete', completeJob);

/**
 * @swagger
 * /api/v1/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 */
router.put('/:id/cancel', cancelBooking);

export default router;