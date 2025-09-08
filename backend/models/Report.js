const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  reason: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
