const Task = require('../models/task.model');
const { success, error } = require('../utils/response');
const TASK_STATUS = require('../constants/taskStatus');

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

module.exports = { getEmployeeDashboard };
