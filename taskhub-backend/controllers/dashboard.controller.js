const Task = require('../models/task.model');
const User = require('../models/user.model');
const { success, error } = require('../utils/response');
const TASK_STATUS = require('../constants/taskStatus');
const mongoose = require('mongoose');


// ------------* Employee Dashboard data *------------
const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const assignedTasks = await Task.find({ assignedTo: userId });

    const completedTasksCount = assignedTasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;

    const pendingTasksCount = assignedTasks.filter(task =>
      [TASK_STATUS.BACKLOG, TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS].includes(task.status)
    ).length;

    const overdueTasksCount = assignedTasks.filter(task =>
      new Date(task.dueDate) < now &&
      task.status !== TASK_STATUS.COMPLETED
    ).length;

    const upcomingDueTasks = assignedTasks.filter(task =>
      new Date(task.dueDate) >= now &&
      new Date(task.dueDate) <= sevenDaysLater &&
      task.status !== TASK_STATUS.COMPLETED
    );

    const completionRate = assignedTasks.length > 0
      ? ((completedTasksCount / assignedTasks.length) * 100).toFixed(2)
      : "0.00";

    return success(res, 'Employee dashboard data', {
      assignedTasksCount: assignedTasks.length,
      completedTasksCount,
      pendingTasksCount,
      overdueTasksCount,
      taskCompletionRate: `${completionRate}%`,
      upcomingDueTasks,
    });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch employee dashboard data', 500);
  }
};


// ------------* Manager Dashboard data *------------
const getManagerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const tasks = await Task.find({ createdBy: userId }).populate('assignedTo', 'name email');

    const totalTasksCreated = tasks.length;
    const assignedTasks = tasks.filter(task => task.assignedTo);
    const overdueTasks = tasks.filter(
      task => task.dueDate && new Date(task.dueDate) < now && task.status !== TASK_STATUS.COMPLETED
    );

    const completedAssignedTasks = assignedTasks.filter(task => task.status === TASK_STATUS.COMPLETED);

    const taskSummaryByEmployee = {};
    assignedTasks.forEach(task => {
      const key = `${task.assignedTo.name} (${task.assignedTo.email})`;
      if (!taskSummaryByEmployee[key]) {
        taskSummaryByEmployee[key] = { assigned: 0, completed: 0 };
      }
      taskSummaryByEmployee[key].assigned += 1;
      if (task.status === TASK_STATUS.COMPLETED) {
        taskSummaryByEmployee[key].completed += 1;
      }
    });

    const completionRate = assignedTasks.length > 0
      ? ((completedAssignedTasks.length / assignedTasks.length) * 100).toFixed(2)
      : "0.00";

    return success(res, 'Manager dashboard data', {
      totalTasksCreated,
      assignedTasksCount: assignedTasks.length,
      overdueTasksCount: overdueTasks.length,
      taskCompletionRate: `${completionRate}%`,
      taskSummaryByEmployee,
    });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch manager dashboard data', 500);
  }
};


// ------------* Admin Dashboard data *------------
const getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();

    const totalUsers = await User.countDocuments();
    const userCountByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const formattedUserCount = userCountByRole.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const totalTasks = await Task.countDocuments();
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const formattedTasksByStatus = tasksByStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const overdueTasksCount = await Task.countDocuments({
      dueDate: { $lt: now },
      status: { $ne: TASK_STATUS.COMPLETED }
    });

    const totalCompletedTasks = formattedTasksByStatus[TASK_STATUS.COMPLETED] || 0;
    const completionRate = totalTasks > 0
      ? ((totalCompletedTasks / totalTasks) * 100).toFixed(2)
      : "0.00";

    const topPerformers = await Task.aggregate([
      { $match: { status: TASK_STATUS.COMPLETED, assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', completedCount: { $sum: 1 } } },
      { $sort: { completedCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          completedCount: 1,
          name: { $arrayElemAt: ['$user.name', 0] },
          email: { $arrayElemAt: ['$user.email', 0] },
        }
      }
    ]);

    return success(res, 'Admin dashboard data', {
      totalUsers,
      userCountByRole: formattedUserCount,
      totalTasks,
      tasksByStatus: formattedTasksByStatus,
      overdueTasksCount,
      taskCompletionRate: `${completionRate}%`,
      topPerformers,
    });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch admin dashboard data', 500);
  }
};



module.exports = { getEmployeeDashboard, getManagerDashboard, getAdminDashboard };
