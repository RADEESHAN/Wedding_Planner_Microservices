// controllers/EventController.js

const axios = require("axios");
const Event = require("../models/Event0054");

// Create a new event
// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { name, date, venue, type } = req.body;
    const event = new Event({ name, date, venue, type });
    await event.save();
    console.log(`Event created with ID: ${event._id}`);

    // Notify Task Service to create default tasks for the event
    const taskResponse = await axios.post(
      `${process.env.TASK_SERVICE_URL}/tasks`,
      {
        eventId: event._id,
        title: "Default Task",
        description: "This is a default task.",
        status: "Pending",
      }
    );
    console.log(
      `Default task created with ID: ${taskResponse.data._id} for event ID: ${event._id}`
    );

    // Add the created taskId to the event's taskIds
    event.taskIds.push(taskResponse.data._id);
    await event.save();
    console.log(
      `Task ID: ${taskResponse.data._id} associated with event ID: ${event._id}`
    );

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get event details along with tasks and vendors
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Initialize empty arrays for tasks and vendors
    let tasks = [];
    let vendors = [];

    // Fetch associated tasks from Task Service if taskIds exist
    if (event.taskIds.length > 0) {
      try {
        const tasksResponse = await axios.get(
          `${process.env.TASK_SERVICE_URL}/tasks`,
          {
            params: { eventId: event._id },
          }
        );
        tasks = tasksResponse.data;
        console.log(`Fetched ${tasks.length} tasks for event ID: ${event._id}`);
      } catch (tasksError) {
        console.error("Error fetching tasks:", tasksError.message);
        // Optionally, you can set tasks to an empty array or include an error message
      }
    }

    // Fetch associated vendors from Vendor Service if vendorIds exist
    if (event.vendorIds.length > 0) {
      try {
        const vendorsResponse = await axios.get(
          `${process.env.VENDOR_SERVICE_URL}/api`,
          {
            params: { eventId: event._id },
          }
        );
        vendors = vendorsResponse.data;
        console.log(
          `Fetched ${vendors.length} vendors for event ID: ${event._id}`
        );
      } catch (vendorsError) {
        console.error("Error fetching vendors:", vendorsError.message);
        // Optionally, you can set vendors to an empty array or include an error message
      }
    }

    // Assemble comprehensive event data
    const comprehensiveEvent = {
      _id: event._id,
      name: event.name,
      date: event.date,
      venue: event.venue,
      type: event.type,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      tasks, // Array of task objects
      vendors, // Array of vendor objects
    };

    res.json(comprehensiveEvent);
  } catch (error) {
    console.error("Error fetching comprehensive event:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
// Update event details
exports.updateEvent = async (req, res) => {
  try {
    const { name, date, venue, type } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { name, date, venue, type },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Notify Task Service to delete associated tasks
    try {
      await axios.delete(
        `${process.env.TASK_SERVICE_URL}/tasks/event/${req.params.id}`
      );
    } catch (taskDeleteError) {
      console.error(
        "Error deleting associated tasks:",
        taskDeleteError.message
      );
      // Optionally, handle this scenario
    }

    // Notify Vendor Service to delete associated vendors
    try {
      await axios.delete(
        `${process.env.VENDOR_SERVICE_URL}/vendors/event/${req.params.id}`
      );
    } catch (vendorDeleteError) {
      console.error(
        "Error deleting associated vendors:",
        vendorDeleteError.message
      );
      // Optionally, handle this scenario
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a task to an event
exports.addTaskToEvent = async (req, res) => {
  try {
    const { taskId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Avoid duplicates
    if (!event.taskIds.includes(taskId)) {
      event.taskIds.push(taskId);
      await event.save();
    }

    res.json(event);
  } catch (error) {
    console.error("Error adding task to event:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a vendor to an event
exports.addVendorToEvent = async (req, res) => {
  try {
    const { vendorId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Avoid duplicates
    if (!event.vendorIds.includes(vendorId)) {
      event.vendorIds.push(vendorId);
      await event.save();
    }

    res.json(event);
  } catch (error) {
    console.error("Error adding vendor to event:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
