const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// Apply for a job (workers only)
router.post('/apply', auth, applicationController.applyForJob);

// Get applications for a specific job (employers only)
router.get('/job/:jobId', auth, applicationController.getJobApplications);

// Assign worker to job (employers only)
router.post('/assign', auth, applicationController.assignWorker);

// Get worker's applications (workers only)
router.get('/worker', auth, applicationController.getWorkerApplications);

module.exports = router; 