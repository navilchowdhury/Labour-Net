const express = require('express');
const { createJob, getJobs, getEmployerJobs } = require('../controllers/jobController');
const auth = require('../middleware/auth');
const router = express.Router();

// Optional auth middleware - doesn't fail if no token
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    // If token exists, use auth middleware
    return auth(req, res, next);
  }
  // If no token, continue without user
  next();
};

router.post('/', auth, createJob); // Only employer
router.get('/', optionalAuth, getJobs); // Anyone (optional auth for user role)
router.get('/employer', auth, getEmployerJobs); // Get employer's posted jobs
router.patch('/:jobId/complete', auth, require('../controllers/jobController').markJobCompleted); // Mark job as completed

module.exports = router;