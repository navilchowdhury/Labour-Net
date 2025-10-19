const mongoose = require('mongoose');

// Data validation middleware to ensure data integrity
const validateApplicationData = async (req, res, next) => {
  try {
    const Application = require('../models/Application');
    const Job = require('../models/Job');
    const User = require('../models/user');
    
    const { jobId, workerId, employerId } = req.body;
    
    // Validate job exists
    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(400).json({ error: 'Job not found' });
      }
    }
    
    // Validate worker exists and is a worker
    if (workerId) {
      const worker = await User.findById(workerId);
      if (!worker || worker.role !== 'worker') {
        return res.status(400).json({ error: 'Worker not found' });
      }
    }
    
    // Validate employer exists and is an employer
    if (employerId) {
      const employer = await User.findById(employerId);
      if (!employer || employer.role !== 'employer') {
        return res.status(400).json({ error: 'Employer not found' });
      }
    }
    
    next();
  } catch (error) {
    console.error('Data validation error:', error);
    res.status(500).json({ error: 'Data validation failed' });
  }
};

const validateReviewData = async (req, res, next) => {
  try {
    const Review = require('../models/Review');
    const Job = require('../models/Job');
    const User = require('../models/user');
    
    const { workerId, employerId, jobId, rating } = req.body;
    
    // Validate rating is between 1 and 5
    if (rating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Validate worker exists and is a worker
    if (workerId) {
      const worker = await User.findById(workerId);
      if (!worker || worker.role !== 'worker') {
        return res.status(400).json({ error: 'Worker not found' });
      }
    }
    
    // Validate employer exists and is an employer
    if (employerId) {
      const employer = await User.findById(employerId);
      if (!employer || employer.role !== 'employer') {
        return res.status(400).json({ error: 'Employer not found' });
      }
    }
    
    // Validate job exists if provided
    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(400).json({ error: 'Job not found' });
      }
    }
    
    next();
  } catch (error) {
    console.error('Review validation error:', error);
    res.status(500).json({ error: 'Review validation failed' });
  }
};

const validateJobData = async (req, res, next) => {
  try {
    const User = require('../models/user');
    const { employer, category, title } = req.body;
    
    // Validate employer exists and is an employer
    if (employer) {
      const employerUser = await User.findById(employer);
      if (!employerUser || employerUser.role !== 'employer') {
        return res.status(400).json({ error: 'Employer not found' });
      }
    }
    
    // Validate required fields
    if (!category || !title) {
      return res.status(400).json({ error: 'Category and title are required' });
    }
    
    next();
  } catch (error) {
    console.error('Job validation error:', error);
    res.status(500).json({ error: 'Job validation failed' });
  }
};

// Cleanup orphaned data middleware
const cleanupOrphanedData = async (req, res, next) => {
  try {
    const Application = require('../models/Application');
    const Job = require('../models/Job');
    const Review = require('../models/Review');
    const User = require('../models/user');
    
    // Clean up orphaned applications (applications referencing non-existent jobs)
    const applications = await Application.find({}).populate('job');
    const orphanedApplications = applications.filter(app => !app.job);
    
    if (orphanedApplications.length > 0) {
      const orphanedIds = orphanedApplications.map(app => app._id);
      await Application.deleteMany({ _id: { $in: orphanedIds } });
      console.log(`Cleaned up ${orphanedIds.length} orphaned applications`);
    }
    
    // Clean up orphaned reviews (reviews referencing non-existent workers/employers)
    const reviews = await Review.find({})
      .populate('worker')
      .populate('employer');
    
    const orphanedReviews = reviews.filter(review => 
      !review.worker || !review.employer || 
      review.worker.role !== 'worker' || 
      review.employer.role !== 'employer'
    );
    
    if (orphanedReviews.length > 0) {
      const orphanedReviewIds = orphanedReviews.map(review => review._id);
      await Review.deleteMany({ _id: { $in: orphanedReviewIds } });
      console.log(`Cleaned up ${orphanedReviewIds.length} orphaned reviews`);
    }
    
    // Clean up invalid reviews (reviews with invalid ratings)
    const invalidReviews = await Review.find({
      $or: [
        { rating: { $lt: 1 } },
        { rating: { $gt: 5 } },
        { rating: { $type: 'string' } }
      ]
    });
    
    if (invalidReviews.length > 0) {
      const invalidReviewIds = invalidReviews.map(review => review._id);
      await Review.deleteMany({ _id: { $in: invalidReviewIds } });
      console.log(`Cleaned up ${invalidReviewIds.length} invalid reviews`);
    }
    
    next();
  } catch (error) {
    console.error('Cleanup error:', error);
    // Don't fail the request if cleanup fails
    next();
  }
};

module.exports = {
  validateApplicationData,
  validateReviewData,
  validateJobData,
  cleanupOrphanedData
};
