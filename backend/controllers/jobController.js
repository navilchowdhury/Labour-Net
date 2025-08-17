const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Only employers can post jobs' });
    const job = new Job({ ...req.body, employer: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { category, salary } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (salary) filter.salaryRange = salary;
    const jobs = await Job.find(filter).populate('employer', 'name contact');
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};