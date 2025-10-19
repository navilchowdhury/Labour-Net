const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contact: { type: String },
  address: { type: String },
  dob: { type: Date },
  sex: { type: String, enum: ['male', 'female', 'other'] },
  password: { type: String, required: true },
  role: { type: String, enum: ['worker', 'employer'], required: true },
  jobPreferences: [{ type: String }],
  availability: { type: String },
  workHistory: { type: String },
  isCompany: { type: Boolean, default: false },
  nidNumber: { type: String },
  isNidVerified: { type: Boolean, default: false },

  // Track how many times an employer has been reported
  reportedCount: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
