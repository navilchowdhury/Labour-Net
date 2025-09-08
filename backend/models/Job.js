const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  workingHours: String,
  salary: String,
  salaryRange: String, // Keep for backward compatibility
  location: String,
  address: String, // Keep for backward compatibility
  description: String,
  status: { type: String, enum: ['open', 'assigned', 'completed'], default: 'open' },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  createdAt: { type: Date, default: Date.now }
});

//module.exports = mongoose.model('Job', jobSchema);
module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);