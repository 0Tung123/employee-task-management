const messageService = require('../services/messageService');

class MessageController {
  async sendMessage(req, res) {
    try {
      const { toId, text } = req.body;
      const { userId: fromId, userType: fromType } = req.user;

      if (!toId || !text || text.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: toId and text'
        });
      }

      const toType = fromType === 'owner' ? 'employee' : 'owner';

      const messageData = {
        fromId,
        fromType,
        toId,
        toType,
        text: text.trim()
      };

      const message = await messageService.createMessage(messageData);

      const io = req.app.get('io');
      if (io) {
        const toRoom = `${toType}_${toId}`;
        io.to(toRoom).emit('new_message', {
          ...message,
          fromType,
          toType
        });
      }

      res.status(201).json({
        success: true,
        message: message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  }

  async getConversation(req, res) {
    try {
      const { otherUserId } = req.params;
      const { userId } = req.user;
      const { lastMessageId, limit } = req.query;

      const messages = await messageService.getConversation(
        userId, 
        otherUserId, 
        lastMessageId,
        parseInt(limit) || 50
      );

      await messageService.markConversationAsRead(userId, otherUserId, userId);

      res.json({
        success: true,
        messages: messages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get conversation'
      });
    }
  }

  async getConversations(req, res) {
    try {
      const { userId } = req.user;

      const conversations = await messageService.getUserConversations(userId);

      res.json({
        success: true,
        conversations: conversations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get conversations'
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const { messageId } = req.params;
      
      await messageService.markAsRead(messageId);

      res.json({
        success: true,
        message: 'Message marked as read'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to mark message as read'
      });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const { userId } = req.user;
      
      const unreadCount = await messageService.getUnreadCount(userId);

      res.json({
        success: true,
        unreadCount: unreadCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get unread count'
      });
    }
  }
}

module.exports = new MessageController();