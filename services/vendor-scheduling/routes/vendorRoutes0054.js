// wedding-planner-vendor-service/routes/vendors.js

const express = require("express");
const router = express.Router();
const vendorsController = require("../controllers/VendorController0054");

// 1. Define specific routes first (if any)

// 2. Define general routes
// Get all vendors, optionally filtered by eventId
router.get("/", vendorsController.getAllVendors);

// Get a single vendor by ID
router.get("/:id", vendorsController.getVendorById);

// Add a new vendor
router.post("/", vendorsController.addVendor);

// Update vendor schedule
router.put("/:id/schedule", vendorsController.updateVendorSchedule);

// Remove a vendor
router.delete("/:id", vendorsController.deleteVendor);

// Delete vendors associated with an event
router.delete("/event/:eventId", vendorsController.deleteVendorsByEvent);

module.exports = router;
