const Guest = require('../models/Guest0054');
const axios = require('axios');

// Add a new guest
exports.addGuest0054 = async (req, res) => {
    try {
        const guest = new Guest(req.body);
        await guest.save();
        res.status(201).json(guest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update guest information
exports.updateGuest0054 = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!guest) return res.status(404).json({ message: 'Guest not found' });
        res.json(guest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a guest
exports.deleteGuest0054 = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndDelete(req.params.id);
        if (!guest) return res.status(404).json({ message: 'Guest not found' });
        res.json({ message: 'Guest deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send an RSVP request (This could involve sending an email/SMS, but for simplicity, we'll simulate it)
exports.sendRsvpRequest0054 = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (!guest) return res.status(404).json({ message: 'Guest not found' });
        
        // Simulate sending RSVP request
        // In a real application, integrate with an email/SMS service here

        res.json({ message: `RSVP request sent to ${guest.name}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Track RSVP responses
exports.trackRsvpResponses0054 = async (req, res) => {
    try {
        const guests = await Guest.find();
        const rsvpSummary = {
            pending: 0,
            accepted: 0,
            declined: 0,
        };

        guests.forEach(guest => {
            if (guest.rsvp === 'pending') rsvpSummary.pending += 1;
            if (guest.rsvp === 'accepted') rsvpSummary.accepted += 1;
            if (guest.rsvp === 'declined') rsvpSummary.declined += 1;
        });

        res.json(rsvpSummary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


///////////////////////////////////////////
exports.addGuest0054 = async (req, res) => {
    try {
        const { eventId, name, email } = req.body;

        // Verify the event exists
        const eventResponse = await axios.get(`${process.env.EVENT_SERVICE_URL}/api/events/${eventId}`);
        if (!eventResponse.data) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const guest = new Guest(req.body);
        await guest.save();
        res.status(201).json(guest);
    } catch (error) {
        res.status(500).json({ message: 'Error adding guest', error: error.message });
    }
};