// wedding-planner-task-service/routes/tasks.js

const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/TaskController0054");

router.get("/", tasksController.getTasks);
router.get("/:id", tasksController.getTaskById);
router.post("/", tasksController.addTask);
router.put("/:id/status", tasksController.updateTaskStatus);
router.delete("/:id", tasksController.deleteTask);
router.delete("/event/:eventId", tasksController.deleteTasksByEvent);

module.exports = router;
