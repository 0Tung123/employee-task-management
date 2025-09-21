const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/CreateNewAccessCode', authController.CreateNewAccessCode);
router.post('/LoginEmail', authController.LoginEmail);
router.post('/ValidateAccessCode', authController.ValidateAccessCode);

module.exports = router;