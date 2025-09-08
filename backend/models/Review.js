const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
