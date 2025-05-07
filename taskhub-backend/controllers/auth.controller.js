const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');
const { logAudit } = require('../utils/audit.service');
const AUDIT_ACTIONS = require('../constants/auditActions');
const ROLES = require('../constants/roles');



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


// -------* Get All Users (filtered by role) *-------
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const query = {};

    if (req.user.role === ROLES.ADMIN)
      query.role = { $ne: ROLES.ADMIN };
    else if (req.user.role === ROLES.MANAGER)
      query.role = ROLES.EMPLOYEE;

    if (role && role !== ROLES.ADMIN && req.user.role === ROLES.ADMIN && req.user.role !== ROLES.MANAGER)
      query.role = role;

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return success(res, 'Users fetched successfully', {
      users,
      totalUsers,
      totalPages,
      currentPage: page,
    }, 200);

  } catch (err) {
    console.error(err);
    return error(res, 'Something went wrong while fetching users', 500, err.message);
  }
};


module.exports = { register, login, getAllUsers };
