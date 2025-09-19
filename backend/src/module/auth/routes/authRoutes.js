const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Owner Login - SMS OTP
router.post('/CreateNewAccessCode', authController.CreateNewAccessCode);

// Employee Login - Email OTP
router.post('/LoginEmail', authController.LoginEmail);

// Validate OTP - Both Owner & Employee
router.post('/ValidateAccessCode', authController.ValidateAccessCode);

module.exports = router;