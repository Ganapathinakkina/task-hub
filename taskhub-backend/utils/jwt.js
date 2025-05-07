const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, "taskhub@*125%SeceretKey", { expiresIn: '1h' });
};

module.exports = { generateToken };
