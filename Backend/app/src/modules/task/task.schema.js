import joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";

export const addTaskSchema = joi
  .object({
    title: joi.string().required().messages({
      "string.base": "Title must be text",
      "any.required": "Task title is required",
    }),
    description: joi.string().required().messages({
      "string.base": "Description must be text",
      "any.required": "Task description is required",
    }),
    status: joi.string().messages({
      "string.base": "Status must be text",
    }),
    userId: joi.custom(objectIdValidation).required().messages({
      "any.required": "User ID is required",
    }),
    assignTo: joi.custom(objectIdValidation).required().messages({
      "any.required": "Please select a user to assign this task to",
    }),
    deadline: joi.date().messages({
      "date.base": "Please enter a valid date",
    }),
  })
  .required();

export const updateSchema = joi.object({
  title: joi.string().required().messages({
    "string.base": "Title must be text",
    "any.required": "Task title is required",
  }),
  description: joi.string().required().messages({
    "string.base": "Description must be text",
    "any.required": "Task description is required",
  }),
  status: joi.string().messages({
    "string.base": "Status must be text",
  }),
  assignTo: joi.custom(objectIdValidation).required().messages({
    "any.required": "Please select a user to assign this task to",
  }),
});
