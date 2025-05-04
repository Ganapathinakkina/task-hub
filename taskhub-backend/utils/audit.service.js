const AuditLog = require('../models/audit.model');

const logAudit = async ({ userId, action, description, metadata }) => {
  try {
    await AuditLog.create({ userId, action, description, metadata });
  } catch (err) {
    console.error('Failed to log audit:', err.message);
  }
};

module.exports = { logAudit };
