const mongoose = require('mongoose');

class CleanupService {
  constructor() {
    this.isRunning = false;
  }

  async cleanupOrphanedData() {
    if (this.isRunning) {
      console.log('Cleanup already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting data cleanup...');

    try {
      const Application = require('../models/Application');
      const Job = require('../models/Job');
      const Review = require('../models/Review');
      const User = require('../models/user');

      let totalCleaned = 0;

      // Clean up orphaned applications
      console.log('Cleaning orphaned applications...');
      const applications = await Application.find({}).populate('job');
      const orphanedApplications = applications.filter(app => !app.job);
      
      if (orphanedApplications.length > 0) {
        const orphanedIds = orphanedApplications.map(app => app._id);
        await Application.deleteMany({ _id: { $in: orphanedIds } });
        console.log(`✅ Cleaned up ${orphanedIds.length} orphaned applications`);
        totalCleaned += orphanedIds.length;
      }

      // Clean up orphaned reviews
      console.log('Cleaning orphaned reviews...');
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
        console.log(`✅ Cleaned up ${orphanedReviewIds.length} orphaned reviews`);
        totalCleaned += orphanedReviewIds.length;
      }

      // Clean up invalid reviews
      console.log('Cleaning invalid reviews...');
      const invalidReviews = await Review.find({
        $or: [
          { rating: { $lt: 1 } },
          { rating: { $gt: 5 } },
          { rating: { $type: 'string' } },
          { rating: { $exists: false } }
        ]
      });
      
      if (invalidReviews.length > 0) {
        const invalidReviewIds = invalidReviews.map(review => review._id);
        await Review.deleteMany({ _id: { $in: invalidReviewIds } });
        console.log(`✅ Cleaned up ${invalidReviewIds.length} invalid reviews`);
        totalCleaned += invalidReviewIds.length;
      }

      // Clean up orphaned jobs (jobs with no valid employer)
      console.log('Cleaning orphaned jobs...');
      const jobs = await Job.find({}).populate('employer');
      const orphanedJobs = jobs.filter(job => 
        !job.employer || job.employer.role !== 'employer'
      );
      
      if (orphanedJobs.length > 0) {
        const orphanedJobIds = orphanedJobs.map(job => job._id);
        await Job.deleteMany({ _id: { $in: orphanedJobIds } });
        console.log(`✅ Cleaned up ${orphanedJobIds.length} orphaned jobs`);
        totalCleaned += orphanedJobIds.length;
      }

      console.log(`🎉 Data cleanup completed. Total records cleaned: ${totalCleaned}`);
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Run cleanup every hour
  startScheduledCleanup() {
    console.log('Starting scheduled data cleanup (every hour)...');
    
    // Run cleanup immediately
    this.cleanupOrphanedData();
    
    // Then run every hour
    setInterval(() => {
      this.cleanupOrphanedData();
    }, 60 * 60 * 1000); // 1 hour
  }

  // Validate and fix user data
  async validateUserData() {
    console.log('Validating user data...');
    
    try {
      const User = require('../models/user');
      
      // Find users with invalid jobPreferences (not arrays)
      const usersWithInvalidJobPrefs = await User.find({
        jobPreferences: { $exists: true, $not: { $type: 'array' } }
      });
      
      for (const user of usersWithInvalidJobPrefs) {
        console.log(`Fixing jobPreferences for user ${user.name}`);
        await User.findByIdAndUpdate(user._id, { jobPreferences: [] });
      }
      
      // Find users with invalid workHistory (arrays instead of strings)
      const usersWithInvalidWorkHistory = await User.find({
        workHistory: { $type: 'array' }
      });
      
      for (const user of usersWithInvalidWorkHistory) {
        console.log(`Fixing workHistory for user ${user.name}`);
        let workHistoryString = '';
        if (Array.isArray(user.workHistory)) {
          workHistoryString = user.workHistory
            .filter(item => item && item.trim() !== '')
            .join('\n');
        }
        await User.findByIdAndUpdate(user._id, { workHistory: workHistoryString });
      }
      
      console.log('✅ User data validation completed');
      
    } catch (error) {
      console.error('❌ User data validation failed:', error);
    }
  }
}

module.exports = new CleanupService();
