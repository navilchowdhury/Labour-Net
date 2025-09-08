const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Send a message
router.post('/send', auth, messageController.sendMessage);

// Get conversation with specific user
router.get('/conversation/:userId', auth, messageController.getConversation);

// Get all conversations
router.get('/conversations', auth, messageController.getConversations);

// Get unread message count
router.get('/unread-count', auth, messageController.getUnreadCount);

// Mark conversation as read
router.put('/mark-read/:userId', auth, messageController.markConversationAsRead);

module.exports = router;
