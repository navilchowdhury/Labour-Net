const Review = require('../models/Review');
const Job = require('../models/Job');
const User = require('../models/user');

// Create a review for a worker after job completion
exports.createReview = async (req, res) => {
  try {
    const { worker: workerId, job: jobId, workerId: altWorkerId, jobId: altJobId, rating, comment } = req.body;
    const actualWorkerId = workerId || altWorkerId;
    const actualJobId = jobId || altJobId;
    
    console.log('Review request:', { workerId, jobId, altWorkerId, altJobId, actualWorkerId, actualJobId, rating, comment });
    console.log('Request user:', req.user);

    // Verify employer role
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can create reviews' });
    }

    // Verify job exists and belongs to employer
    const job = await Job.findById(actualJobId).populate('assignedWorker');
    if (!job) {
      console.log('Job not found:', actualJobId);
      return res.status(404).json({ error: 'Job not found' });
    }
    
    console.log('Job found:', job);
    
    if (job.employer.toString() !== req.user.id) {
      console.log('Job ownership mismatch:', { jobEmployer: job.employer, userId: req.user.id });
      return res.status(403).json({ error: 'Unauthorized - not job owner' });
    }

    // Verify worker is assigned to job
    if (!job.assignedWorker) {
      console.log('No worker assigned to job');
      return res.status(400).json({ error: 'No worker assigned to this job' });
    }
    
    const assignedWorkerId = job.assignedWorker._id ? job.assignedWorker._id.toString() : job.assignedWorker.toString();
    if (assignedWorkerId !== actualWorkerId) {
      console.log('Worker assignment mismatch:', { assignedWorker: assignedWorkerId, workerId: actualWorkerId });
      return res.status(400).json({ error: 'Worker is not assigned to this job' });
    }

    // Verify job is completed
    if (job.status !== 'completed') {
      console.log('Job not completed:', job.status);
      return res.status(400).json({ error: 'Job must be completed before review' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      employer: req.user.id,
      worker: actualWorkerId,
      job: actualJobId
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this job' });
    }

    // Create review
    const review = new Review({
      employer: req.user.id,
      worker: actualWorkerId,
      job: actualJobId,
      rating: parseInt(rating),
      comment
    });

    await review.save();

    // Populate review with job and employer details before deleting job
    const populatedReview = await Review.findById(review._id)
      .populate('employer', 'name isCompany')
      .populate('job', 'category title location salary');

    // After review is submitted, remove the job post
    await Job.findByIdAndDelete(actualJobId);

    res.status(201).json({ ...populatedReview.toObject(), jobRemoved: true });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Get reviews for a worker
exports.getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;

    const reviews = await Review.find({ worker: workerId })
      .populate('employer', 'name isCompany')
      .populate('job', 'category title location salary')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    res.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (err) {
    console.error('Get worker reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get reviews created by an employer
exports.getEmployerReviews = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view their reviews' });
    }

    const reviews = await Review.find({ employer: req.user.id })
      .populate('worker', 'name contact')
      .populate('job', 'category title location salary')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('Get employer reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch employer reviews' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      employer: req.user.id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.rating = parseInt(rating);
    review.comment = comment;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('employer', 'name isCompany')
      .populate('job', 'category title location salary');

    res.json(populatedReview);
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({
      _id: reviewId,
      employer: req.user.id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
