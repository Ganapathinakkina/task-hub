const mongoose = require('mongoose');
const ROLES = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
      default: ROLES.EMPLOYEE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
