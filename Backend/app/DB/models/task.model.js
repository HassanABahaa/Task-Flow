import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500,
      trim: true,
    },
    status: { type: String, enum: ["toDo", "doing", "done"], default: "toDo" },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    assignTo: { type: Types.ObjectId, ref: "User" },
    deadline: { type: Date },
  },
  { timestamps: true },
);

export const Task = model("Task", taskSchema);
