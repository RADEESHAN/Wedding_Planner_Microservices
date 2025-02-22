// models/Vendor.js

const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      // Removed 'ref: "Event"' to prevent Mongoose from attempting to populate
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "Catering",
        "Florist",
        "Photography",
        "Music",
        "Decoration",
        "Other",
      ],
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String,
    },
    schedule: {
      date: Date,
      time: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", VendorSchema);
