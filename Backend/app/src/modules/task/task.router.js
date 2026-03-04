import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as taskController from "./task.controller.js";
import { addTaskSchema, updateSchema } from "./task.schema.js";

const router = Router();

// add task
router.post(
  "/addtask",
  isAuthenticated,
  validation(addTaskSchema),
  asyncHandler(taskController.addTask)
);

// update task
router.patch(
  "/update",
  isAuthenticated,
  validation(updateSchema),
  asyncHandler(taskController.update)
);

// delete task
router.delete(
  "/delete",
  isAuthenticated,
  asyncHandler(taskController.deleteTask)
);

// all tasks
router.get("/tasks", isAuthenticated, asyncHandler(taskController.tasks));

// tasks of oneUser
router.get(
  "/tasksoneuser",
  isAuthenticated,
  asyncHandler(taskController.tasksOneUser)
);

// tasks Not Done
router.get(
  "/tasksnotnone",
  isAuthenticated,
  asyncHandler(taskController.tasksNotDone)
);

export default router;
