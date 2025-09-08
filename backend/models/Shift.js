const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  description: {
    type: String
  },
  contactPerson: {
    type: String
  },
  phone: {
    type: String
  }
}, { timestamps: true });

// Index for efficient queries
shiftSchema.index({ worker: 1, day: 1 });

module.exports = mongoose.model('Shift', shiftSchema);
