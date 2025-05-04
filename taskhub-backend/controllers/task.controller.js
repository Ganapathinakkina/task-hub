const Task = require('../models/task.model');
const { success, error } = require('../utils/response');
const ROLES = require('../constants/roles');
const AUDIT_ACTIONS = require('../constants/auditActions');
const { logAudit } = require('../utils/audit.service');



// -------* Create Task (Admin & Manager) *-------
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.user.id,
      assignedTo,
    });

    await task.save();

    await logAudit({
      userId: req.user.id,
      action: AUDIT_ACTIONS.TASK_CREATED,
      description: `Task "${title}" created.`,
      metadata: { taskId: task._id.toString() },
    });

    return success(res, 'Task created successfully', task, 201);
  } catch (err) {
    return error(res, 'Error creating task', 500);
  }
};

// -------* Get All Tasks (filtered by role) *-------
const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, createdBy, dueDate, priority, status, search } = req.query;
    
    const query = {};
    
    if (createdBy)
      query.createdBy = createdBy;

    if (dueDate)
      query.dueDate = dueDate;

    if (priority)
      query.priority = priority;

    if (status)
      query.status = status;
    
    if (search)
      query.$text = { $search: search };



    else
      tasks = await Task.find();


    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();
    
    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limit);
    

    return success(res, 'Tasks fetched successfully', {
      tasks,
      totalTasks,
      totalPages,
      currentPage: page,
    }, 200);

  } catch (err) {
    console.error(err);
    return error(res, "Something went wrong while retrieving the tasks..!!", 500, err.message);

  }
};


// -------* Get Task by ID *-------
const getTaskById = async (req, res) => {
  try 
  {
    const task = await Task.findById(req.params.id);
    if (!task) 
      return error(res, 'Task not found', 404);

    if (req.user.role === ROLES.EMPLOYEE && (task.assignedTo!=undefined && task.assignedTo.toString()) !== req.user.id)
      return error(res, 'Access denied', 403);

    await logAudit({
      userId: req.user.id,
      action: AUDIT_ACTIONS.TASK_VIEWED,
      description: `User viewed task "${task.title}"`,
      metadata: { taskId: task._id.toString() },
    });

    return success(res, 'Task fetched successfully', task);
  } catch (err) {
    console.error(err);
    return error(res, 'Error fetching task', 500);
  }
};

// -------* Update Task (Employee can update Task status only)*-------
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return error(res, 'Task not found', 404);

    if (req.user.role === ROLES.EMPLOYEE) 
    {
      if (task.assignedTo==undefined || task.assignedTo.toString() !== req.user.id)
        return error(res, 'Access denied', 403);
      
        task.status = req.body.status;
    } 
    else
    // -------Admin/Manager can update all fields-------
      Object.assign(task, req.body);

    await task.save();

    await logAudit({
      userId: req.user.id,
      action: AUDIT_ACTIONS.TASK_UPDATED,
      description: `Task "${task.title}" updated`,
      metadata: { taskId: task._id.toString() },
    });

    return success(res, 'Task updated successfully', task);
  } catch (err) {
    console.error(err);
    return error(res, 'Error updating task', 500);
  }
};

// -------* Delete Task (Admin/Manager only) *-------
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task)
      return error(res, 'Task not found', 404);

    await logAudit({
      userId: req.user.id,
      action: AUDIT_ACTIONS.TASK_DELETED,
      description: `Task "${task.title}" deleted`,
      metadata: { taskId: task._id.toString() },
    });

    return success(res, 'Task deleted successfully', task);
  } catch (err) {
    return error(res, 'Error deleting task', 500);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
