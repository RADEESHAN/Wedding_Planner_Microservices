// wedding-planner-event-service/routes/events.js

const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/EventController0054");

// 1. Define specific routes first
// Add a task to an event
router.put("/:id/tasks", eventsController.addTaskToEvent);

// Add a vendor to an event
router.put("/:id/vendors", eventsController.addVendorToEvent);

// 2. Define general routes after specific routes
// Create a new event
router.post("/", eventsController.createEvent);

// Get event details along with tasks and vendors
router.get("/:id", eventsController.getEvent);

// Update event details
router.put("/:id", eventsController.updateEvent);

// Delete an event
router.delete("/:id", eventsController.deleteEvent);

module.exports = router;
