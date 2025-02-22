const Notification = require('../models/Notification0054');
const { sendEmail0054 } = require('../utils/emailService0054');

// Send reminder notification
exports.sendReminderNotification0054 = async (req, res) => {
    try {
        const { recipient, message } = req.body;
        const notification = new Notification({
            type: 'reminder',
            message,
            recipient,
            preferences: { email: true, sms: false }, // For simplicity
        });

        // Send email if preference is true
        if (notification.preferences.email) {
            await sendEmail0054(recipient, 'Wedding Planner Reminder', message);
        }

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Failed to send reminder notification', error: error.message });
    }
};

// Track notifications sent
exports.trackNotificationsSent0054 = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage notification preferences
exports.manageNotificationPreferences0054 = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
