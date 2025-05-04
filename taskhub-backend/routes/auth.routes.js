const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const ROLES = require('../constants/roles');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');
const { success } = require('../utils/response');
const taskController = require('../controllers/task.controller');

router.post('/register', register);
router.post('/login', login);

// router.get('/protected', verifyToken, allowRoles(ROLES.ADMIN, ROLES.MANAGER), (req, res) => {
//     return success(res, `Hello ${req.user.role}, you're authorized to access this route`);
//   });

router.post('/', verifyToken, allowRoles(ROLES.ADMIN, ROLES.MANAGER), taskController.createTask);
router.get('/', verifyToken, taskController.getAllTasks);
router.get('/:id', verifyToken, taskController.getTaskById);
router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, allowRoles(ROLES.ADMIN, ROLES.MANAGER), taskController.deleteTask);



module.exports = router;
