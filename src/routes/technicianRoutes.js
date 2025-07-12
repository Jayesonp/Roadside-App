import express from 'express';
import {
  getTechnicianProfile,
  updateTechnicianProfile,
  updateLocation,
  updateAvailability,
  getCurrentBookings,
  getPerformanceStats,
  getAllTechnicians,
  getNearbyTechnicians,
  createTechnicianProfile,
  getTechnicianById,
  updateTechnicianById
} from '../controllers/technicianController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import {
  updateLocationValidation,
  updateAvailabilityValidation,
  createTechnicianValidation
} from '../validators/technicianValidators.js';

const router = express.Router();

// Apply authentication to all technician routes
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Technician:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         employeeId:
 *           type: string
 *         specializations:
 *           type: array
 *           items:
 *             type: string
 *         certificationLevel:
 *           type: string
 *           enum: [basic, intermediate, advanced, expert]
 *         hourlyRate:
 *           type: number
 *         serviceRadiusKm:
 *           type: integer
 *         isAvailable:
 *           type: boolean
 *         isOnDuty:
 *           type: boolean
 *         rating:
 *           type: number
 *         phone:
 *           type: string
 *         vehicleInfo:
 *           type: object
 *         emergencyCertified:
 *           type: boolean
 */

/**
 * @swagger
 * /api/v1/technicians/profile:
 *   get:
 *     summary: Get current technician profile
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technician profile retrieved successfully
 *       404:
 *         description: Technician profile not found
 */
router.get('/profile', getTechnicianProfile);

/**
 * @swagger
 * /api/v1/technicians/profile:
 *   put:
 *     summary: Update current technician profile
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specializations:
 *                 type: array
 *                 items:
 *                   type: string
 *               certificationLevel:
 *                 type: string
 *               hourlyRate:
 *                 type: number
 *               serviceRadiusKm:
 *                 type: integer
 *               phone:
 *                 type: string
 *               vehicleInfo:
 *                 type: object
 *               emergencyCertified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', updateTechnicianProfile);

/**
 * @swagger
 * /api/v1/technicians/location:
 *   put:
 *     summary: Update technician location
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               accuracy:
 *                 type: number
 *               heading:
 *                 type: number
 *               speed:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated successfully
 */
router.put('/location', updateLocationValidation, handleValidation, updateLocation);

/**
 * @swagger
 * /api/v1/technicians/availability:
 *   put:
 *     summary: Update technician availability
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isAvailable
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *               isOnDuty:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Availability updated successfully
 */
router.put('/availability', updateAvailabilityValidation, handleValidation, updateAvailability);

/**
 * @swagger
 * /api/v1/technicians/current-bookings:
 *   get:
 *     summary: Get current bookings for technician
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current bookings retrieved successfully
 */
router.get('/current-bookings', getCurrentBookings);

/**
 * @swagger
 * /api/v1/technicians/performance:
 *   get:
 *     summary: Get technician performance statistics
 *     tags: [Technicians]
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
 *         description: Performance statistics retrieved successfully
 */
router.get('/performance', getPerformanceStats);

/**
 * @swagger
 * /api/v1/technicians/nearby:
 *   get:
 *     summary: Get nearby technicians
 *     tags: [Technicians]
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
 *         name: maxDistance
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Nearby technicians retrieved successfully
 */
router.get('/nearby', getNearbyTechnicians);

// Admin-only routes
/**
 * @swagger
 * /api/v1/technicians:
 *   get:
 *     summary: Get all technicians (admin only)
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isOnDuty
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Technicians retrieved successfully
 */
router.get('/', authorize('admin'), getAllTechnicians);

/**
 * @swagger
 * /api/v1/technicians:
 *   post:
 *     summary: Create technician profile (admin only)
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - employeeId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               employeeId:
 *                 type: string
 *               specializations:
 *                 type: array
 *                 items:
 *                   type: string
 *               hourlyRate:
 *                 type: number
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Technician profile created successfully
 */
router.post('/', authorize('admin'), createTechnicianValidation, handleValidation, createTechnicianProfile);

/**
 * @swagger
 * /api/v1/technicians/{id}:
 *   get:
 *     summary: Get technician by ID (admin only)
 *     tags: [Technicians]
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
 *         description: Technician retrieved successfully
 */
router.get('/:id', authorize('admin'), getTechnicianById);

/**
 * @swagger
 * /api/v1/technicians/{id}:
 *   put:
 *     summary: Update technician by ID (admin only)
 *     tags: [Technicians]
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
 *             $ref: '#/components/schemas/Technician'
 *     responses:
 *       200:
 *         description: Technician updated successfully
 */
router.put('/:id', authorize('admin'), updateTechnicianById);

export default router;