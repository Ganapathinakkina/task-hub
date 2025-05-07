const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return error(res, 'Unauthorized Access', 401, 'No token provided');
  
  const token = authHeader.split(' ')[1];

  try 
  {
    const decoded = jwt.verify(token, "taskhub@*125%SeceretKey");
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Unauthorized Access', 401, 'Invalid or expired token');
    }
    next();
  };
};

module.exports = { verifyToken, allowRoles };
