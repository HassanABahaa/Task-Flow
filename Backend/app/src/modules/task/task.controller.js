import { Task } from "../../../DB/models/task.model.js";
import { User } from "../../../DB/models/user.model.js";

export const addTask = async (req, res, next) => {
  let { title, description, status, assignTo, deadline } = req.body;

  let assignToId = req.user._id;

  if (assignTo) {
    const assignedUser = await User.findOne({ email: assignTo });
    if (!assignedUser)
      return next(new Error("Assigned user not found", { cause: 404 }));
    assignToId = assignedUser._id;
  }

  const task = await Task.create({
    title,
    description,
    status,
    userId: req.user._id,
    assignTo: assignToId,
    deadline,
  });

  return res.status(201).json({
    success: true,
    msg: "Task created successfully",
    results: { task },
  });
};

export const update = async (req, res, next) => {
  const { _id, title, description, status, assignTo } = req.body;

  // دور على التاسك بالـ _id
  const task = await Task.findById(_id);
  if (!task) return next(new Error("Task not found", { cause: 404 }));

  // check owner
  if (task.userId.toString() !== req.user._id.toString())
    return next(new Error("Task owner only can update", { cause: 403 }));

  // update fields
  task.title = title;
  task.description = description;
  task.status = status;

  // assign to user by email
  if (assignTo) {
    const assignedUser = await User.findOne({ email: assignTo });
    if (!assignedUser)
      return next(new Error("Assigned user not found", { cause: 404 }));
    task.assignTo = assignedUser._id;
  }

  await task.save();

  return res.status(200).json({
    success: true,
    msg: `Task updated successfully`,
    result: { task },
  });
};

export const deleteTask = async (req, res, next) => {
  const { _id } = req.body;

  const task = await Task.findById(_id);
  if (!task) return next(new Error("Task not found", { cause: 404 }));

  if (task.userId.toString() !== req.user._id.toString())
    return next(new Error("Owner only can delete task", { cause: 403 }));

  await task.deleteOne();
  return res
    .status(200)
    .json({ success: true, msg: "Task deleted successfully" });
};

export const tasks = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Task.countDocuments({
    $or: [{ userId: req.user._id }, { assignTo: req.user._id }],
  });

  const tasks = await Task.find({
    $or: [{ userId: req.user._id }, { assignTo: req.user._id }],
  })
    .populate({ path: "userId", select: { userName: 1, email: 1 } })
    .populate({ path: "assignTo", select: { userName: 1, email: 1 } })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  });
};

export const tasksOneUser = async (req, res, next) => {
  const tasks = await Task.find({
    $or: [{ userId: req.user._id }, { assignTo: req.user._id }],
  })
    .populate({ path: "userId", select: { userName: 1, email: 1 } })
    .populate({ path: "assignTo", select: { userName: 1, email: 1 } });
  return res.status(200).json({ tasks });
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
