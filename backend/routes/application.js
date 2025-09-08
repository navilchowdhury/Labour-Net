const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

const {
    applyForJob,
    getJobApplications,
    assignWorker,
    getWorkerApplications,
    getWorkerAssignedJobs,
    reportEmployer,
    reviewWorker,
    getWorkerReviews
  } = require('../controllers/applicationController');
  
  const { getWorkerProfile } = require('../controllers/userProfileController');

// Apply for a job (workers only)
router.post('/', auth, applyForJob);

// Get applications for a specific job (employers only)
router.get('/job/:jobId', auth, getJobApplications);

// Assign worker to job (employers only)
router.post('/assign', auth, assignWorker);

// Get worker's applications (workers only)
router.get('/worker', auth, getWorkerApplications);

// Get worker's assigned jobs (workers only) - MUST come before /worker/:id/profile
router.get('/worker/assigned', auth, getWorkerAssignedJobs);

// ✅ NEW: Employer can view a worker's profile + job history
router.get('/worker/:id/profile', auth, getWorkerProfile);

// ✅ NEW: Worker reports employer
router.post('/report', auth, reportEmployer);

// ✅ NEW: Employer reviews worker
router.post('/review', auth, reviewWorker);

// ✅ NEW: Get worker reviews (for employers to see when considering applications)
router.get('/worker/:workerId/reviews', auth, getWorkerReviews);

module.exports = router; 