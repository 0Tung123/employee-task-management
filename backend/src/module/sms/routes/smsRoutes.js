const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/create-access-code', smsController.createNewAccessCode);

router.post('/validate-access-code', smsController.validateAccessCode);

module.exports = router;