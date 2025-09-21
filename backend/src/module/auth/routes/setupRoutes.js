const express = require('express');
const router = express.Router();
const employeeController = require('../../owner/controllers/employeeController');

router.post('/verify-token', employeeController.VerifyToken);
router.post('/setup-account', employeeController.SetupAccount);

module.exports = router;