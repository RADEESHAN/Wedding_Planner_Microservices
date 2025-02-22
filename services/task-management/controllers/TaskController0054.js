// controllers/TaskController.js

const axios = require("axios");
const Task = require("../models/Task0054");

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { eventId, title, description, status, assignedTo, dueDate } =
      req.body;

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

    const task = new Task({
      eventId,
      title,
      description,
      status,
      assignedTo,
      dueDate,
    });
    await task.save();

    // Notify Event Service to add this taskId to the event's taskIds
    try {
      await axios.put(
        `${process.env.EVENT_SERVICE_URL}/events/${eventId}/tasks`,
        {
          taskId: task._id,
        }
      );
    } catch (notifyError) {
      console.error("Error notifying Event Service:", notifyError.message);
      // Optionally, handle this scenario (e.g., delete the task or mark as unlinked)
      // For simplicity, we'll proceed without rollback
    }

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error updating task status:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Notify Event Service to remove this taskId from the event's taskIds
    try {
      await axios.put(
        `${process.env.EVENT_SERVICE_URL}/events/${task.eventId}/tasks/remove`,
        {
          taskId: req.params.id,
        }
      );
    } catch (notifyError) {
      console.error("Error notifying Event Service:", notifyError.message);
      // Optionally, handle this scenario (e.g., recreate the task or mark as deleted)
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a list of tasks by status or eventId
exports.getTasks = async (req, res) => {
  try {
    const { status, eventId } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (eventId) {
      filter.eventId = eventId;
    }
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete tasks associated with an event
exports.deleteTasksByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await Task.deleteMany({ eventId });
    res.json({
      message: "Associated tasks deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting associated tasks:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
