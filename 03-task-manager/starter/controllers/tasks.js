const Task = require("../models/Task");
const asyncWrapper = require("../middlewares/async");
const { createError } = require("../errors/custom-error");

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  return res.status(200).json({ tasks, count: tasks.length, success: true });
});

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  return res.status(201).json({ task, success: true });
});

const getTask = asyncWrapper(async (req, res, next) => {
  let { id: taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) {
    // custom error object
    // const err = new Error("Not Found");
    // err.status = 404;

    // call custom error handler
    return next(createError(`No task with id ${taskId}`, 404));
  }
  return res.status(200).json({ task, success: false });
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskId });
  if (!task) {
    next(createError(`No task with id ${taskId}`, 404));
  }
  return res.status(200).json({ success: true });
});

// caveate:
// use option to get the updated value back
// use option to run validator
const updateTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true
  });
  if (!task) {
    next(createError(`No task with id ${taskId}`, 404));
  }
  return res.status(200).json({ task: task, success: true });
});

// patch: modifies existing item, only pass in properties to update
// put: replace existing item
const putTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
    overwrite: true
  });
  if (!task) {
    next(createError(`No task with id ${taskId}`, 404));
  }
  return res.status(200).json({ task: task, success: true });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};