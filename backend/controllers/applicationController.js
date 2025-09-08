const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/user');
const Notification = require('../models/Notification');
const Report = require('../models/Report');   // [ADDED]
const Review = require('../models/Review');   // [ADDED]

// Worker applies for a job
exports.applyForJob = async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can apply' });
    }

    const { job: jobId, coverLetter, jobId: altJobId } = req.body;
    const actualJobId = jobId || altJobId;
    console.log('Application request:', { jobId, altJobId, actualJobId, coverLetter, userId: req.user.id });
    
    const job = await Job.findById(actualJobId);
    if (!job) {
      console.log('Job not found:', actualJobId);
      return res.status(404).json({ error: 'Job not found' });
    }
    
    console.log('Found job:', job);

    const existing = await Application.findOne({ job: actualJobId, worker: req.user.id });
    if (existing) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    const application = new Application({
      job: actualJobId,
      worker: req.user.id,
      employer: job.employer,
      message: coverLetter,
      status: 'pending'
    });
    
    console.log('Application object created:', application);
    await application.save();
    console.log('Application saved successfully');

    job.applications.push(application._id);
    await job.save();

    res.status(201).json(application);
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Failed to apply' });
  }
};

// Employer views applications for a job
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log('Getting applications for job:', jobId);
    console.log('Employer user:', req.user);
    
    const Review = require('../models/Review');
    
    const job = await Job.findById(jobId);
    if (!job) {
      console.log('Job not found:', jobId);
      return res.status(404).json({ error: 'Job not found' });
    }

    console.log('Job found:', job);
    console.log('Job employer:', job.employer);
    console.log('Request user ID:', req.user.id);

    // Check if user is the employer of this job
    if (job.employer.toString() !== req.user.id) {
      console.log('Unauthorized access to job applications');
      return res.status(403).json({ error: 'Unauthorized - not job owner' });
    }

    // Get all applications for this job
    const applications = await Application.find({ job: jobId })
      .populate('worker', 'name contact jobPreferences availability address isNidVerified')
      .sort({ createdAt: -1 });

    console.log(`Found ${applications.length} applications for job ${jobId}`);

    // Enhance applications with worker job history and reviews
    const enhancedApplications = await Promise.all(
      applications.map(async (application) => {
        // Get worker's job history
        const assignedJobs = await Application.find({
          worker: application.worker._id,
          status: { $in: ['assigned', 'completed'] }
        })
        .populate({
          path: 'job',
          populate: {
            path: 'employer',
            select: 'name isCompany'
          }
        })
        .sort({ createdAt: -1 })
        .limit(10);

        // Get worker's reviews
        const reviews = await Review.find({ worker: application.worker._id })
          .populate('employer', 'name isCompany')
          .populate('job', 'category title')
          .sort({ createdAt: -1 });

        // Calculate average rating
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;

        // Format job history with reviews
        const jobHistory = await Promise.all(assignedJobs.map(async (app) => {
          const jobReview = reviews.find(review => 
            review.job._id.toString() === app.job._id.toString()
          );

          return {
            jobId: app.job._id,
            jobTitle: app.job.title || `${app.job.category} Position`,
            jobCategory: app.job.category,
            employerName: app.job.employer.name,
            isCompany: app.job.employer.isCompany,
            status: app.status,
            assignedDate: app.updatedAt,
            salary: app.job.salary || app.job.salaryRange,
            location: app.job.location || app.job.address,
            review: jobReview ? {
              rating: jobReview.rating,
              comment: jobReview.comment,
              reviewDate: jobReview.createdAt
            } : null
          };
        }));

        return {
          ...application.toObject(),
          worker: {
            ...application.worker.toObject(),
            jobHistory: jobHistory,
            reviews: {
              total: reviews.length,
              averageRating: Math.round(averageRating * 10) / 10,
              recentReviews: reviews.slice(0, 3)
            }
          }
        };
      })
    );

    res.json(enhancedApplications);
  } catch (err) {
    console.error('Get job applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Employer assigns a worker
exports.assignWorker = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can assign' });
    }

    const { jobId, workerId } = req.body;
    
    console.log('Assignment request:', { jobId, workerId, employerId: req.user.id });
    
    // Verify job exists and belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      console.log('Job not found:', { jobId });
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.employer.toString() !== req.user.id) {
      console.log('Job ownership mismatch:', { jobEmployer: job.employer, userId: req.user.id });
      return res.status(403).json({ error: 'Unauthorized - not job owner' });
    }

    console.log('Job found:', job);

    // Verify worker exists and has applied
    const User = require('../models/user');
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      console.log('Worker not found or invalid role:', { workerId, worker });
      return res.status(404).json({ error: 'Worker not found' });
    }

    console.log('Worker found:', worker);

    const application = await Application.findOne({ job: jobId, worker: workerId });
    if (!application) {
      console.log('Application not found:', { jobId, workerId });
      return res.status(404).json({ error: 'Application not found' });
    }

    console.log('Application found:', application);

    // Update job
    job.assignedWorker = workerId;
    job.status = 'assigned';
    await job.save();

    // Update applications - reject others, assign selected
    await Application.updateMany(
      { job: jobId, worker: { $ne: workerId } },
      { $set: { status: 'rejected' } }
    );

    await Application.findOneAndUpdate(
      { job: jobId, worker: workerId },
      { $set: { status: 'assigned' } }
    );

    // Clean up job match notifications
    const Notification = require('../models/Notification');
    await Notification.deleteMany({ 
      job: jobId, 
      type: 'job_match' 
    });

    console.log(`Worker ${workerId} assigned to job ${jobId}`);

    res.json({ message: 'Worker assigned successfully', job });
  } catch (err) {
    console.error('Assign worker error:', err);
    res.status(500).json({ error: 'Failed to assign worker', details: err.message });
  }
};

// Worker views their applications
exports.getWorkerApplications = async (req, res) => {
  try {
    const apps = await Application.find({ worker: req.user.id })
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'name contact isCompany'
        }
      })
      .sort({ createdAt: -1 });

    // Get reviews for completed applications
    const Review = require('../models/Review');
    const appsWithReviews = await Promise.all(
      apps.map(async (app) => {
        if (app.status === 'completed' && app.job) {
          const review = await Review.findOne({
            worker: req.user.id,
            job: app.job._id
          }).populate('employer', 'name isCompany');
          
          return {
            ...app.toObject(),
            review: review
          };
        }
        return app.toObject();
      })
    );

    res.json(appsWithReviews);
  } catch (err) {
    console.error('Get worker applications error:', err);
    res.status(500).json({ error: 'Failed to fetch worker applications' });
  }
};

// Worker views their assigned jobs (for reporting purposes)
exports.getWorkerAssignedJobs = async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can view assigned jobs' });
    }

    const assignedJobs = await Job.find({ 
      assignedWorker: req.user.id,
      status: 'assigned'
    })
      .populate('employer', 'name contact reportedCount')
      .sort({ createdAt: -1 });

    res.json(assignedJobs);
  } catch (err) {
    console.error('Get assigned jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch assigned jobs' });
  }
};

/* =========================
   NEW FEATURES
   ========================= */

// Worker reports employer (only if assigned)
exports.reportEmployer = async (req, res) => {
  try {
    console.log('Report employer request:', { body: req.body, user: req.user });
    
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can report employers' });
    }

    const { jobId, reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ error: 'Reason for reporting is required' });
    }

    const job = await Job.findById(jobId).populate('employer');
    if (!job) return res.status(404).json({ error: 'Job not found' });

    console.log('Job found:', { 
      jobId: job._id, 
      assignedWorker: job.assignedWorker, 
      userId: req.user.id,
      assignedWorkerType: typeof job.assignedWorker,
      userIdType: typeof req.user.id,
      stringComparison: String(job.assignedWorker) === String(req.user.id)
    });

    if (String(job.assignedWorker) !== String(req.user.id)) {
      return res.status(403).json({ error: 'You are not assigned to this job' });
    }

    // Save report
    const report = new Report({
      worker: req.user.id,
      employer: job.employer._id,
      job: job._id,
      reason
    });
    await report.save();

    // Increment employer's reportedCount
    const employer = await User.findById(job.employer._id);
    if (employer) {
      employer.reportedCount = (employer.reportedCount || 0) + 1;
      await employer.save();
    }

    res.json({ message: 'Employer reported successfully', report });
  } catch (err) {
    console.error('Report employer error:', err);
    res.status(500).json({ error: 'Failed to report employer' });
  }
};

// Employer reviews worker (1–5 stars)
exports.reviewWorker = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can review workers' });
    }

    const { jobId, workerId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (String(job.employer) !== String(req.user.id)) {
      return res.status(403).json({ error: 'You are not the employer of this job' });
    }
    if (String(job.assignedWorker) !== String(workerId)) {
      return res.status(403).json({ error: 'This worker was not assigned to this job' });
    }

    const review = new Review({
      employer: req.user.id,
      worker: workerId,
      job: jobId,
      rating,
      comment
    });
    await review.save();

    res.json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('Review worker error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

// Get worker reviews for a specific worker
exports.getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;
    
    const reviews = await Review.find({ worker: workerId })
      .populate('employer', 'name')
      .populate('job', 'category')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
    
    res.json({ 
      reviews, 
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length 
    });
  } catch (err) {
    console.error('Get worker reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch worker reviews' });
  }
};
