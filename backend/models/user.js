const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['worker', 'employer'], required: true },
  name: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  dob: { type: Date, required: true },
  sex: { type: String, required: true },
  password: { type: String, required: true },
  // Worker-specific
  jobPreferences: [String],
  availability: String,
  workHistory: String,
  // Employer-specific
  jobTypes: [String],
  hiringPreferences: String,
  isCompany: Boolean,
});

module.exports = mongoose.model('User', userSchema);