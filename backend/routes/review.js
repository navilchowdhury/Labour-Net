const express = require('express');
const { 
  createReview, 
  getWorkerReviews, 
  getEmployerReviews, 
  updateReview, 
  deleteReview 
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a review (employer only)
router.post('/', auth, createReview);

// Get reviews for a specific worker
router.get('/worker/:workerId', getWorkerReviews);

// Get reviews created by the logged-in employer
router.get('/employer', auth, getEmployerReviews);

// Update a review (employer only)
router.put('/:reviewId', auth, updateReview);

// Delete a review (employer only)
router.delete('/:reviewId', auth, deleteReview);

module.exports = router;
