const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { authenticateToken, requireRole } = require('../../../middleware/auth.middleware');

router.post('/', ownerController.createOwner);

router.get('/profile', authenticateToken, requireRole(['owner', 'manager']), ownerController.getOwnerProfile);

module.exports = router;