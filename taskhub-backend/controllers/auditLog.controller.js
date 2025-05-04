const AuditLog = require('../models/audit.model');
const { success, error } = require('../utils/response');

const getAuditLogs = async (req, res) => {
  try 
  {
    const { userId, action, from, to, limit = 100 } = req.query;

    const query = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('userId', 'name email role');

    return success(res, 'Audit logs fetched successfully', logs);
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch audit logs', 500);
  }
};

module.exports = { getAuditLogs };
