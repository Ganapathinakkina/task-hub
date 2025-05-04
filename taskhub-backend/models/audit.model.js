const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  description: { type: String },
  metadata: { type: Object },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AuditLog', auditSchema);
