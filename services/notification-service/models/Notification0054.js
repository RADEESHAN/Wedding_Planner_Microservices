const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['reminder', 'update', 'other'], required: true },
    message: { type: String, required: true },
    recipient: { type: String, required: true }, // Could be an email or phone number
    preferences: { 
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
    },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
}, { timestamps: true });

module.exports = mongoose.model(`Notification${process.env.INDEX_NUMBER}`, NotificationSchema);
