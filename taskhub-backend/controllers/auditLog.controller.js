const AuditLog = require('../models/audit.model');
const { success, error } = require('../utils/response');

const getAuditLogs = async (req, res) => {

  try 
  {
    const { userId, action, from, to, limit = 100, page = 1 } = req.query;

    const query = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const pageNum = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNum - 1) * pageSize;

    const [logs, totalCount] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('userId', 'name email role'),
      AuditLog.countDocuments(query)
    ]);

    return success(res, 'Audit logs fetched successfully', {
      logs,
      pagination: {
        total: totalCount,
        page: pageNum,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      }
    });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch audit logs', 500);
  }
};


module.exports = { getAuditLogs };
