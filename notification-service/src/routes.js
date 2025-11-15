const express = require('express');
const Notification = require('./models');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'notification-service' });
});

// Get notifications for authenticated user
router.get('/notifications', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }
    
    const notifications = await Notification.getByUserId(userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send notification (internal - called by other services)
router.post('/notifications/send', async (req, res) => {
  try {
    const { user_id, message } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const notificationId = await Notification.create(user_id, message);
    res.status(201).json({ success: true, data: { id: notificationId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all notifications (admin)
router.get('/notifications/all', async (req, res) => {
  try {
    const notifications = await Notification.getAll();
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
