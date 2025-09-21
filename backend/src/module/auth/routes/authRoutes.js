const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/CreateNewAccessCode', authController.CreateNewAccessCode);
router.post('/LoginEmail', authController.LoginEmail);
router.post('/ValidateAccessCode', authController.ValidateAccessCode);
router.post('/employee-login', authController.EmployeeLogin);

module.exports = router;