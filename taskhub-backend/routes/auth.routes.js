const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const ROLES = require('../constants/roles');

router.post('/register', register);
router.post('/login', login);

router.get('/protected', verifyToken, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), (req, res) => {
    return success(res, `Hello ${req.user.role}, you're authorized to access this route`);
  });


module.exports = router;
