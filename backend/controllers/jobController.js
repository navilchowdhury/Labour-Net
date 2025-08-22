const Job = require('../models/Job');
const User = require('../models/user');
const Notification = require('../models/Notification');

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Only employers can post jobs' });
    
    const job = new Job({ ...req.body, employer: req.user.id });
    await job.save();
    
    // Find workers whose job preferences match this job category
    const matchingWorkers = await User.find({
      role: 'worker',
      $elemMatch: { $regex: new RegExp(`^${job.category}$`, 'i') }
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
    const { category, salary } = req.query;
    let filter = { status: { $ne: 'assigned' } }; // Only hide jobs that are assigned to workers
    if (category) filter.category = category;
    if (salary) filter.salaryRange = salary;
    
    const jobs = await Job.find(filter)
      .populate('employer', 'name contact')
      .populate('assignedWorker', 'name')
      .populate({
        path: 'applications',
        populate: {
          path: 'worker',
          select: 'name contact jobPreferences availability workHistory'
        }
      });
      
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};