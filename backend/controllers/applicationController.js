const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/user');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, message } = req.body;
    const workerId = req.user.id;

    console.log('Applying for job:', { jobId, workerId, message });

    // Check if user is a worker
    if (req.user.role !== 'worker') {
      console.log('User is not a worker:', req.user.role);
      return res.status(403).json({ message: 'Only workers can apply for jobs' });
    }

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      console.log('Job not found:', jobId);
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.status !== 'open') {
      console.log('Job is not open:', job.status);
      return res.status(400).json({ message: 'Job is not open for applications' });
    }

    console.log('Job found:', job.category, 'Employer:', job.employer);

    // Check if worker has already applied
    const existingApplication = await Application.findOne({ job: jobId, worker: workerId });
    if (existingApplication) {
      console.log('Worker already applied for this job');
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Check if worker's expertise matches job category
    const worker = await User.findById(workerId);
    console.log('=== BACKEND EXPERTISE MATCHING DEBUG ===');
    console.log('Worker job preferences:', worker.jobPreferences);
    console.log('Worker job preferences type:', typeof worker.jobPreferences);
    console.log('Worker job preferences length:', worker.jobPreferences?.length);
    console.log('Job category:', job.category);
    console.log('Job category type:', typeof job.category);
    
    if (worker.jobPreferences && worker.jobPreferences.length > 0) {
      worker.jobPreferences.forEach((pref, index) => {
        console.log(`Preference ${index}:`, pref, 'Type:', typeof pref);
        console.log(`Comparing: "${pref.toLowerCase()}" === "${job.category.toLowerCase()}"`);
        console.log(`Match result:`, pref.toLowerCase() === job.category.toLowerCase());
      });
    }
    
    // Check if at least one expertise matches the job category (robust matching)
    const hasMatchingExpertise = (() => {
      // Safety checks
      if (!worker.jobPreferences) {
        console.log('No job preferences found');
        return false;
      }
      
      if (!Array.isArray(worker.jobPreferences)) {
        console.log('Job preferences is not an array:', worker.jobPreferences);
        return false;
      }
      
      if (worker.jobPreferences.length === 0) {
        console.log('Job preferences array is empty');
        return false;
      }
      
      // Try exact match first
      const exactMatch = worker.jobPreferences.some(pref => 
        pref === job.category
      );
      if (exactMatch) {
        console.log('Exact match found');
        return true;
      }
      
      // Try case-insensitive match
      const caseInsensitiveMatch = worker.jobPreferences.some(pref => 
        pref.toLowerCase() === job.category.toLowerCase()
      );
      if (caseInsensitiveMatch) {
        console.log('Case-insensitive match found');
        return true;
      }
      
      // Try partial match (in case there are extra spaces or formatting)
      const partialMatch = worker.jobPreferences.some(pref => 
        pref.toLowerCase().trim() === job.category.toLowerCase().trim()
      );
      if (partialMatch) {
        console.log('Partial match found after trimming');
        return true;
      }
      
      console.log('No matches found');
      return false;
    })();
    
    console.log('Final hasMatchingExpertise result:', hasMatchingExpertise);
    console.log('=== END BACKEND DEBUG ===');
    
    if (!hasMatchingExpertise) {
      console.log('No expertise matches found');
      return res.status(400).json({ message: 'Your expertise does not match this job category' });
    }

    // Create application
    const application = new Application({
      job: jobId,
      worker: workerId,
      employer: job.employer,
      message: message || ''
    });

    console.log('Creating application:', application);

    await application.save();
    console.log('Application saved successfully');

    // Add application to job
    job.applications.push(application._id);
    await job.save();
    console.log('Application added to job');

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get applications for a specific job (employer only)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    console.log('Getting applications for job:', jobId, 'by employer:', employerId);

    // Check if user is an employer
    if (req.user.role !== 'employer') {
      console.log('User is not an employer:', req.user.role);
      return res.status(403).json({ message: 'Only employers can view job applications' });
    }

    // Check if job exists and belongs to this employer
    const job = await Job.findById(jobId);
    if (!job) {
      console.log('Job not found:', jobId);
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.employer.toString() !== employerId) {
      console.log('Job does not belong to employer. Job employer:', job.employer, 'Requesting employer:', employerId);
      return res.status(403).json({ message: 'You can only view applications for your own jobs' });
    }

    console.log('Job belongs to employer, fetching applications...');

    // Get applications with worker details
    const applications = await Application.find({ job: jobId })
      .populate('worker', 'name contact jobPreferences availability workHistory')
      .sort({ appliedAt: -1 });

    console.log('Found applications:', applications.length);

    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign worker to job
exports.assignWorker = async (req, res) => {
  try {
    const { jobId, workerId } = req.body;
    const employerId = req.user.id;

    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can assign workers' });
    }

    // Check if job exists and belongs to this employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.employer.toString() !== employerId) {
      return res.status(403).json({ message: 'You can only assign workers to your own jobs' });
    }

    // Check if job is open
    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not open for assignment' });
    }

    // Check if worker has applied for this job
    const application = await Application.findOne({ job: jobId, worker: workerId });
    if (!application) {
      return res.status(400).json({ message: 'Worker has not applied for this job' });
    }

    // Update job status and assign worker
    job.status = 'assigned';
    job.assignedWorker = workerId;
    await job.save();

    // Update application status
    application.status = 'assigned';
    application.assignedAt = new Date();
    await application.save();

    // Update all other applications to rejected
    await Application.updateMany(
      { job: jobId, _id: { $ne: application._id } },
      { status: 'rejected' }
    );

    res.json({ message: 'Worker assigned successfully', job });
  } catch (error) {
    console.error('Assign worker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get worker's applications
exports.getWorkerApplications = async (req, res) => {
  try {
    const workerId = req.user.id;

    // Check if user is a worker
    if (req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can view their applications' });
    }

    const applications = await Application.find({ worker: workerId })
      .populate('job', 'category workingHours salaryRange address description status')
      .populate('employer', 'name contact')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get worker applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 