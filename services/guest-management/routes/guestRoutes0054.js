const express = require('express');
const router = express.Router();
const GuestController = require('../controllers/GuestController0054');

// Add a new guest
router.post('/guests', GuestController.addGuest0054);

// Update guest information
router.put('/guests/:id', GuestController.updateGuest0054);

// Delete a guest
router.delete('/guests/:id', GuestController.deleteGuest0054);

// Send an RSVP request
router.post('/guests/:id/send-rsvp', GuestController.sendRsvpRequest0054);

// Track RSVP responses
router.get('/guests/rsvp-summary', GuestController.trackRsvpResponses0054);


router.post('/guests', GuestController.addGuest0054);

module.exports = router;
