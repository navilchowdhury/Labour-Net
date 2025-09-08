const Notification = require('../models/Notification');
const Job = require('../models/Job');

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate({
        path: 'job',
        select: 'category workingHours salaryRange address description employer status',
        populate: { path: 'employer', select: 'name contact' }
      })
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Filter out notifications for assigned jobs
    const filteredNotifications = notifications.filter(notification => 
      notification.job && notification.job.status !== 'assigned'
    );
    
    res.json(filteredNotifications);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all as read error:', err);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });
    
    res.json({ count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
}; 