const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  worker: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  employer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'assigned', 'completed'], 
    default: 'pending' 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  message: {
    type: String,
    default: ''
  },
  assignedAt: {
    type: Date
  }
});

// Ensure one worker can only apply once per job
applicationSchema.index({ job: 1, worker: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema); 