const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken, requireEmployee } = require('../../../middleware/auth.middleware');

router.use(authenticateToken);
router.use(requireEmployee);

router.get('/profile', profileController.GetMyProfile);
router.post('/GetMySchedules', profileController.GetMySchedules);

module.exports = router;