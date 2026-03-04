import { Task } from "../../../DB/models/task.model.js";
import { User } from "../../../DB/models/user.model.js";

export const addTask = async (req, res, next) => {
  let { title, description, status, assignTo, deadline } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    userId: req.user._id,
    assignTo,
    deadline,
  });

  return res.status(201).json({
    success: true,
    msg: "Task created successfully",
    results: { task },
  });
};

export const update = async (req, res, next) => {
  const { title, description, status, assignedTo } = req.body;

  const task = await Task.findOneAndUpdate(
    req.user.userId,
    { title, description, status },
    { new: true }
  );

  // check owner
  if (task.userId.toString() != req.user._id)
    return next(new Error("Task owner only can update", { cause: 403 }));

  // Assing to another user
  if (assignedTo) {
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return next(new Error("Assigned user not found", { cause: 404 }));
    }
    task.assignTo = assignedTo;
  }

  await task.save();

  // response
  return res.status(200).json({
    success: true,
    msg: `Task updated successfully by ${req.user.userName}`,
    result: { task },
  });
};

export const deleteTask = async (req, res, next) => {
  const task = await Task.findOne({ userId: req.user._id });
  if (!task)
    return next(
      new Error("Task not found , User doesn't have tasks", { cause: 404 })
    );

  console.log(task.userId.toString() !== req.user._id.toString());
  console.log(task.userId);
  console.log({ task });

  // check owner
  if (task.userId.toString() !== req.user._id.toString())
    return next(new Error("Owner only can delete task", { cause: 403 }));

  // delete
  await task.deleteOne();
  return res
    .status(200)
    .json({ success: true, msg: "Task deleted successfully" });
};

export const tasks = async (req, res, next) => {
  const tasks = await Task.find().populate({
    path: "userId",
    select: { userName: 1, email: 1, _id: 0 },
  });
  return res.status(200).json({ success: true, tasks });
};

export const tasksOneUser = async (req, res, next) => {
  const tasksOneUser = await Task.findOne({ userId: req.user._id }).populate({
    path: "userId",
    select: { userName: 1, email: 1, _id: 0 },
  });
  return res.status(200).json({ task: tasksOneUser });
};

export const tasksNotDone = async (req, res, next) => {
  const tasks = await Task.find({
    status: { $ne: "done" }, //
    deadline: { $lt: new Date() },
  });
  return res.status(200).json({
    success: true,
    results: { tasks },
  });
};
