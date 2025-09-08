const Job = require('../models/Job');
const User = require('../models/user');
const Notification = require('../models/Notification');

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Only employers can post jobs' });
    
    const { category, workingHours, salaryRange, address, description } = req.body;
    const job = new Job({ 
      employer: req.user.id,
      category,
      title: `${category} Position`,
      workingHours,
      salary: salaryRange,
      location: address,
      description,
      status: 'open'
    });
    await job.save();
    
    // Find workers whose job preferences match this job category
    const rx = new RegExp(`^${escapeRegExp(job.category)}$`, 'i');
    const matchingWorkers = await User.find({
      role: 'worker',
      jobPreferences: { $in: [rx] }
      //$elemMatch: { $regex: new RegExp(`^${job.category}$`, 'i') }
    });
    
    // Create notifications for matching workers
    const notifications = matchingWorkers.map(worker => ({
      recipient: worker._id,
      job: job._id,
      type: 'job_match',
      title: 'New Job Match!',
      message: `A new ${job.category} job has been posted that matches your preferences.`
    }));
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`Created ${notifications.length} notifications for job: ${job.category}`);
    }
    
    res.status(201).json(job);
  } catch (err) {
    console.error('Job creation error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { category, salary, location, minSalary, maxSalary } = req.query;
    let filter = {};

    // Only show open jobs for workers
    if (req.user?.role === 'worker') {
      filter.status = 'open';
    }

    // Apply filters
    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (salary) {
      filter.salary = new RegExp(salary, 'i');
    }

    // Salary range filtering
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) {
        filter.salary.$gte = parseInt(minSalary);
      }
      if (maxSalary) {
        filter.salary.$lte = parseInt(maxSalary);
      }
    }

    const jobs = await Job.find(filter)
      .populate('employer', 'name')
      .sort({ createdAt: -1 });

    // Send job alerts to matching workers
    if (req.user?.role === 'employer' && req.method === 'POST') {
      // This would be called after creating a job
      const matchingWorkers = await User.find({
        role: 'worker',
        jobPreferences: { $in: [filter.category] }
      });

      for (const worker of matchingWorkers) {
        const notification = new Notification({
          user: worker._id,
          type: 'job_match',
          message: `New ${filter.category} job posted that matches your preferences!`,
          jobId: jobs[0]?._id
        });
        await notification.save();
      }
    }

    res.json(jobs);
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get employer's posted jobs
exports.getEmployerJobs = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view their jobs' });
    }

    const jobs = await Job.find({ employer: req.user.id })
      .populate('assignedWorker', 'name contact')
      .populate('applications')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error('Get employer jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch employer jobs' });
  }
};

// Mark job as completed
exports.markJobCompleted = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can mark jobs as completed' });
    }

    const job = await Job.findOne({ _id: jobId, employer: req.user.id });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'assigned') {
      return res.status(400).json({ error: 'Only assigned jobs can be marked as completed' });
    }

    job.status = 'completed';
    await job.save();

    // Update the application status to completed
    const Application = require('../models/Application');
    await Application.findOneAndUpdate(
      { job: jobId, worker: job.assignedWorker, status: 'assigned' },
      { status: 'completed' }
    );
    
    res.json({ message: 'Job marked as completed', job });
  } catch (err) {
    console.error('Mark job completed error:', err);
    res.status(500).json({ error: 'Failed to mark job as completed' });
  }
};