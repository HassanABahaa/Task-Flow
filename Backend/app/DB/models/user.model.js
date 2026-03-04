import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, required: true, min: 5, max: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 18, max: 60 },
    gender: String,
    phone: { type: Number, unique: true },
    isConfirmed: { type: Boolean, default: false },
    forgetCode: { type: String, unique: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
