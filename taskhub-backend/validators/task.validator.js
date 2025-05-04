const { body } = require('express-validator');
const TASK_PRIORITY = require('../constants/taskPriority');
const TASK_STATUS = require('../constants/taskStatus');

const allowedPriorities = Object.values(TASK_PRIORITY);
const allowedStatuses = Object.values(TASK_STATUS);

const createTaskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid ISO date'),
  body('priority')
    .isIn(allowedPriorities)
    .withMessage(`Priority must be one of: ${allowedPriorities.join(', ')}`),
  body('assignedTo').optional().isMongoId().withMessage('AssignedTo must be a valid user ID'),
];

const updateTaskValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('priority')
    .optional()
    .isIn(allowedPriorities)
    .withMessage(`Priority must be one of: ${allowedPriorities.join(', ')}`),
  body('status')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
];

module.exports = {
  createTaskValidation,
  updateTaskValidation,
};
