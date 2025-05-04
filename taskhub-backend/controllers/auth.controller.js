const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');
const AUDIT_ACTIONS = require('../constants/auditActions');



// --------* User Registration controller method *--------
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 'Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    await logAudit({
      userId: user._id,
      action: AUDIT_ACTIONS.USER_REGISTERED,
      description: `${user.name} registered`,
      metadata: { email, role }
    });


    return success(res, 'User registered successfully', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 201);
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

// --------* User Login controller method *--------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return error(res, 'Invalid credentials', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'Invalid credentials', 400);
    }

    const token = generateToken({ id: user._id, role: user.role });

    await logAudit({
      userId: user._id,
      action: AUDIT_ACTIONS.USER_LOGGED_IN,
      description: `${user.name} logged in`,
      metadata: { email }
    });

    
    return success(res, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

module.exports = { register, login };
