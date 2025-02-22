// controllers/VendorController.js

const axios = require("axios");
const Vendor = require("../models/Vendor0054");

// Add a new vendor
exports.addVendor = async (req, res) => {
  try {
    const { eventId, name, serviceType, contactInfo, schedule } = req.body;

    // Verify if the event exists by calling Event Service
    try {
      const eventResponse = await axios.get(
        `${process.env.EVENT_SERVICE_URL}/events/${eventId}`
      );
      if (eventResponse.status !== 200) {
        return res.status(400).json({ message: "Invalid Event ID" });
      }
    } catch (eventError) {
      // If the Event Service returns 404 or any other error
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    // Create the vendor
    const vendor = new Vendor({
      eventId,
      name,
      serviceType,
      contactInfo,
      schedule,
    });
    await vendor.save();

    // **Notify Event Service to add this vendorId to the event's vendorIds**
    try {
      await axios.put(
        `${process.env.EVENT_SERVICE_URL}/events/${eventId}/vendors`,
        {
          vendorId: vendor._id,
        }
      );
    } catch (notifyError) {
      console.error("Error notifying Event Service:", notifyError.message);
      // Optionally, handle this scenario (e.g., delete the vendor or mark as unlinked)
      // For simplicity, we'll proceed without rollback
    }

    res.status(201).json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update vendor schedule
exports.updateVendorSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { schedule },
      { new: true }
    );
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);
  } catch (error) {
    console.error("Error updating vendor schedule:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get vendor details
exports.getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove a vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor removed successfully" });
  } catch (error) {
    console.error("Error removing vendor:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete vendors associated with an event
exports.deleteVendorsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await Vendor.deleteMany({ eventId });
    res.json({
      message: "Associated vendors deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting associated vendors:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all vendors, optionally filtered by eventId
exports.getAllVendors = async (req, res) => {
  try {
    const { eventId } = req.query;
    const filter = eventId ? { eventId } : {};
    const vendors = await Vendor.find(filter);
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
