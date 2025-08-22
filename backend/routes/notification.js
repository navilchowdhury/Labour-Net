const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controllers/notificationController');

// All notification routes require authentication
router.use(auth);

// Get all notifications for the authenticated user
router.get('/', getNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Mark a specific notification as read
router.patch('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllAsRead);

module.exports = router; 