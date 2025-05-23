const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/auth.controller');
const { getAuditLogs } = require('../controllers/auditLog.controller');
const { getEmployeeDashboard, getManagerDashboard, getAdminDashboard } = require('../controllers/dashboard.controller');
const ROLES = require('../constants/roles');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');
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

router.get('/users',
             verifyToken,
             allowRoles(ROLES.ADMIN, ROLES.MANAGER),
             getAllUsers
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
           verifyToken,
           allowRoles(ROLES.ADMIN, ROLES.MANAGER), 
           getAuditLogs
          );


// ********************************** Dashboard management APIs **********************************
router.get('/dashboard/employee', 
            verifyToken, 
            allowRoles(ROLES.EMPLOYEE), 
            getEmployeeDashboard
          );

router.get('/dashboard/manager', 
            verifyToken, 
            allowRoles(ROLES.MANAGER), 
            getManagerDashboard
          );

router.get('/dashboard/admin', 
            verifyToken, 
            allowRoles(ROLES.ADMIN), 
            getAdminDashboard
          );

// *******************************************************************************************


module.exports = router;
