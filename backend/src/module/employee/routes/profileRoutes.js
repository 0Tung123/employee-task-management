const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken, requireEmployee } = require('../../../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(requireEmployee); // Only employees can access these routes

// ==================== EMPLOYEE PROFILE ROUTES ====================

/**
 * @route   GET /api/employee/profile
 * @desc    Get own profile information
 * @access  Employee only
 */
router.get('/profile', profileController.GetMyProfile);

/**
 * @route   POST /api/employee/GetMySchedules
 * @desc    Get own work schedules
 * @access  Employee only
 * @body    { startDate?: string, endDate?: string }
 */
router.post('/GetMySchedules', profileController.GetMySchedules);

module.exports = router;