const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    rsvp: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    // Add more fields as necessary
}, { timestamps: true });

module.exports = mongoose.model(`Guest${process.env.INDEX_NUMBER}`, GuestSchema);
