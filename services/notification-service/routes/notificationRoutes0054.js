const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController0054');

// Send reminder notification
router.post('/notifications/reminder', NotificationController.sendReminderNotification0054);

// Track notifications sent
router.get('/notifications', NotificationController.trackNotificationsSent0054);

// Manage notification preferences
router.put('/notifications/:id/preferences', NotificationController.manageNotificationPreferences0054);

module.exports = router;
