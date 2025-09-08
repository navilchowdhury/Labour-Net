const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { role, name, contact, address, dob, sex, password, jobPreferences, availability, workHistory, jobTypes, hiringPreferences, isCompany, nidNumber, isNidVerified } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this name already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Persist user; verification is optional and handled separately
    const user = new User({
      role, name, contact, address, dob: new Date(dob), sex, password: hashedPassword,
      jobPreferences, availability, workHistory, jobTypes, hiringPreferences, isCompany,
      nidNumber, isNidVerified: Boolean(isNidVerified)
    });

    await user.save();

    res.status(201).json({ message: 'User registered', isNidVerified: user.isNidVerified });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      res.status(400).json({ error: 'A user with this name already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log('Login attempt for user:', name);
    
    const user = await User.findOne({ name });
    if (!user) {
      console.log('User not found:', name);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('User found, checking password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', name);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('Password match successful, creating token...');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    console.log('Creating token for user:', { id: user._id, role: user.role });

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      role: user.role,
      contact: user.contact,
      address: user.address,
      dob: user.dob,
      sex: user.sex,
      jobPreferences: user.jobPreferences,
      availability: user.availability,
      workHistory: user.workHistory,
      jobTypes: user.jobTypes,
      hiringPreferences: user.hiringPreferences,
      isCompany: user.isCompany,
      isNidVerified: user.isNidVerified
    };

    res.json({ token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, contact, address, dob, sex, jobPreferences, availability, workHistory, jobTypes, hiringPreferences, isCompany, location } = req.body;

    // Check for name conflicts
    if (name !== req.user.name) {
      const existingUser = await User.findOne({ name, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this name already exists' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, contact, address, dob: new Date(dob), sex, jobPreferences, availability, workHistory, jobTypes, hiringPreferences, isCompany, location },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Search workers by location (for employers)
exports.searchWorkers = async (req, res) => {
  try {
    console.log('Search workers request from user:', req.user);
    console.log('Query parameters:', req.query);
    
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can search workers', userRole: req.user?.role });
    }

    const { address, jobCategory, availability } = req.query;
    let filter = { role: 'worker' };

    // Build search filters
    if (address && address.trim()) {
      filter.$or = [
        { address: new RegExp(address.trim(), 'i') },
        { location: new RegExp(address.trim(), 'i') }
      ];
    }

    if (jobCategory && jobCategory.trim()) {
      filter.jobPreferences = { $in: [new RegExp(jobCategory.trim(), 'i')] };
    }

    if (availability && availability.trim()) {
      filter.availability = new RegExp(availability.trim(), 'i');
    }

    console.log('Search filter:', JSON.stringify(filter, null, 2));

    const workers = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    console.log(`Found ${workers.length} workers matching criteria`);

    // If no workers found with filters, return all workers for employers
    if (workers.length === 0) {
      console.log('No workers found with filters, returning all workers');
      const allWorkers = await User.find({ role: 'worker' })
        .select('-password')
        .sort({ createdAt: -1 });
      return res.json(allWorkers);
    }

    res.json(workers);
  } catch (err) {
    console.error('Worker search error:', err);
    res.status(500).json({ error: 'Failed to search workers' });
  }
};

// Get worker profile by ID (for employers to view before messaging)
exports.getWorkerProfile = async (req, res) => {
  try {
    const { workerId } = req.params;
    const Application = require('../models/Application');
    const Job = require('../models/Job');
    const Review = require('../models/Review');
    
    const worker = await User.findById(workerId)
      .select('-password');

    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Get worker's job history (assigned jobs)
    const assignedJobs = await Application.find({
      worker: workerId,
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
    .limit(20);

    // Get worker's reviews
    const reviews = await Review.find({ worker: workerId })
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

    const workerProfile = {
      ...worker.toObject(),
      jobHistory: jobHistory,
      reviews: {
        total: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        recentReviews: reviews.slice(0, 5)
      }
    };

    res.json(workerProfile);
  } catch (err) {
    console.error('Get worker profile error:', err);
    res.status(500).json({ error: 'Failed to fetch worker profile' });
  }
};
