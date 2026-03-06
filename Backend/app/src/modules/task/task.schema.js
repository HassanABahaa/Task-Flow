import joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";

export const addTaskSchema = joi
  .object({
    title: joi.string().min(3).max(100).required().messages({
      "string.min": "Title must be at least 3 characters",
      "string.max": "Title must be less than 100 characters",
      "any.required": "Task title is required",
    }),
    description: joi.string().min(5).max(500).required().messages({
      "string.min": "Description must be at least 5 characters",
      "string.max": "Description must be less than 500 characters",
      "any.required": "Task description is required",
    }),
    status: joi
      .string()
      .valid("toDo", "doing", "done")
      .default("toDo")
      .messages({
        "any.only": "Status must be one of: toDo, doing, done",
      }),
    assignTo: joi.string().email().optional().messages({
      "string.email": "Please enter a valid email address",
    }),
    deadline: joi.date().min("now").optional().messages({
      "date.base": "Please enter a valid date",
      "date.min": "Deadline must be a future date",
    }),
  })
  .required();

export const updateSchema = joi.object({
  _id: joi.custom(objectIdValidation).required().messages({
    "any.required": "Task ID is required",
  }),
  title: joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must be less than 100 characters",
    "any.required": "Task title is required",
  }),
  description: joi.string().min(5).max(500).required().messages({
    "string.min": "Description must be at least 5 characters",
    "string.max": "Description must be less than 500 characters",
    "any.required": "Task description is required",
  }),
  status: joi.string().valid("toDo", "doing", "done").messages({
    "any.only": "Status must be one of: toDo, doing, done",
  }),
  assignTo: joi.string().email().optional().messages({
    "string.email": "Please enter a valid email address",
  }),
  deadline: joi.date().optional().messages({
    "date.base": "Please enter a valid date",
  }),
});
