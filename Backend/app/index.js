import express from "express";
import { connectDB } from "./DB/connection.js";
import userRouter from "./src/modules/user/user.router.js";
import taskRouter from "./src/modules/task/task.router.js";
import dotenv from "dotenv";
import cors from "cors";

import "./src/utils/cleanup.cron.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

// CORS - لازم يكون أول حاجة
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "token"],
//   }),
// );
app.use(cors());

app.use(express.json());

// Connect to DB
await connectDB();

// APIs user
app.use("/user", userRouter);

// APIs task
app.use("/task", taskRouter);

// handle not found page
app.all("*", (req, res, next) => {
  return res.status(404).json({ success: false, msg: "Page not found" });
});

// Global error handling
app.use((error, req, res, next) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const messages = {
      email: "This email is already registered",
      phone: "This phone number is already exist",
      userName: "This username is already exist",
    };
    return res.status(400).json({
      success: false,
      msg: messages[field] || "This value already exists",
    });
  }
  const statusCode = error.cause || 500;
  return res
    .status(statusCode)
    .json({ success: false, msg: error.message, stack: error.stack });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
