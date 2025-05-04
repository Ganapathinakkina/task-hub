const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { getAuditLogs } = require('../controllers/auditLog.controller');
const ROLES = require('../constants/roles');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');
const { success } = require('../utils/response');
const taskController = require('../controllers/task.controller');
const {
  createTaskValidation,
  updateTaskValidation,
} = require('../validators/task.validator');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const validate = require('../middlewares/validate');


// ********************************** User management APIs **********************************
router.post('/register',
             registerValidation,
             validate,
             register
            );

router.post('/login',
             loginValidation,
             validate,
             login
            );



// ********************************** Tasks management APIs **********************************

router.post('/task/',
            verifyToken,
            allowRoles(ROLES.ADMIN, ROLES.MANAGER),
            createTaskValidation,
            validate,
            taskController.createTask
          );

router.get('/task/',
           verifyToken,
           taskController.getAllTasks
          );

router.get('/task/:id', 
            verifyToken,
            taskController.getTaskById
          );

router.put('/task/:id', 
            verifyToken, 
            updateTaskValidation,
            validate,
            taskController.updateTask
          );

router.delete('/task/:id',
               verifyToken, 
               allowRoles(ROLES.ADMIN, ROLES.MANAGER), 
               taskController.deleteTask
              );

// ********************************** Audit Logs management APIs **********************************
router.get('/audit-logs',
           authenticate,
           authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), 
           getAuditLogs
          );



// *******************************************************************************************


module.exports = router;
