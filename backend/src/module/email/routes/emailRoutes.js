const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Email OTP routes
router.post('/send-otp', emailController.sendOTP);
router.post('/verify-otp', emailController.verifyOTP);

module.exports = router;