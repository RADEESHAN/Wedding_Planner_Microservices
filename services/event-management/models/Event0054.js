// models/Event.js

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Ceremony", "Reception", "Both"],
      default: "Both",
    },
    vendorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // No ref property to prevent Mongoose from attempting to populate
      },
    ],
    taskIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // No ref property to prevent Mongoose from attempting to populate
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
