const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../../../middleware/auth.middleware');


router.use(authenticateToken);

router.post('/send', messageController.sendMessage);

router.get('/conversation/:otherUserId', messageController.getConversation);

router.get('/conversations', messageController.getConversations);

router.patch('/mark-read/:messageId', messageController.markAsRead);

router.get('/unread-count', messageController.getUnreadCount);

module.exports = router;