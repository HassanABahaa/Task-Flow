import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 18, max: 60 },
    gender: { type: String, enum: ["male", "female"] },
    phone: { type: String, unique: true, sparse: true },
    isConfirmed: { type: Boolean, default: false },
    forgetCode: {
      type: String,
      unique: true,
      sparse: true, //  بيخلي MongoDB يتجاهل الـ null values في الـ index
    },
    deleted: { type: Boolean, default: false },
    activationExpires: { type: Date },
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
