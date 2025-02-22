// models/Task.js

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      // Removed 'ref: "Event"' to prevent Mongoose from attempting to populate
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    assignedTo: String, // Can be enhanced to reference a User model
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
