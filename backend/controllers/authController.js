const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { role, name, contact, address, dob, sex, password, jobPreferences, availability, workHistory, isCompany, nidNumber, isNidVerified } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this name already exists' });
    }

    // Persist user; verification is optional and handled separately
    // Password will be hashed by the pre-save hook in the User model
    const user = new User({
      role, name, contact, address, dob: new Date(dob), sex, password,
      jobPreferences, availability, workHistory, isCompany,
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
    const { name, contact, address, dob, sex, jobPreferences, availability, workHistory, isCompany, location } = req.body;

    // Check for name conflicts
    if (name !== req.user.name) {
      const existingUser = await User.findOne({ name, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this name already exists' });
      }
    }

    // Prepare update object with only valid fields
    const updateData = {
      name,
      contact,
      address,
      dob: dob ? new Date(dob) : undefined,
      sex,
      jobPreferences,
      availability,
      workHistory,
      isCompany,
      location
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
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
      // Case-insensitive search for job categories in array
      filter.jobPreferences = { 
        $in: [
          jobCategory.trim().toLowerCase(),
          jobCategory.trim().toUpperCase(),
          jobCategory.trim().charAt(0).toUpperCase() + jobCategory.trim().slice(1).toLowerCase()
        ]
      };
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
    console.log('Getting worker profile for ID:', workerId);
    
    // Validate ObjectId format
    if (!workerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid worker ID format' });
    }
    
    const Application = require('../models/Application');
    const Job = require('../models/Job');
    const Review = require('../models/Review');
    
    console.log('Step 1: Finding worker in database...');
    const worker = await User.findById(workerId)
      .select('-password');

    if (!worker) {
      console.log('Worker not found in database');
      return res.status(404).json({ error: 'Worker not found' });
    }
    
    if (worker.role !== 'worker') {
      console.log('User found but not a worker, role:', worker.role);
      return res.status(404).json({ error: 'Worker not found' });
    }
    
    console.log('Step 2: Worker found:', worker.name);

    // Get assigned jobs with comprehensive error handling and data validation
    console.log('Step 3: Fetching assigned jobs...');
    let assignedJobs = [];
    let validApplications = [];
    
    try {
      const rawApplications = await Application.find({
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
      
      console.log('Found', rawApplications.length, 'raw applications');
      
      // Filter out applications with missing or invalid job data
      validApplications = rawApplications.filter(app => {
        if (!app.job) {
          console.log('Filtering out application with missing job:', app._id);
          return false;
        }
        if (!app.job.employer) {
          console.log('Filtering out application with missing employer:', app._id);
          return false;
        }
        return true;
      });
      
      assignedJobs = validApplications;
      console.log('Found', assignedJobs.length, 'valid assigned jobs');
      
      // Clean up orphaned applications (those with missing jobs)
      if (rawApplications.length > validApplications.length) {
        console.log('Cleaning up orphaned applications...');
        const orphanedAppIds = rawApplications
          .filter(app => !app.job)
          .map(app => app._id);
        
        if (orphanedAppIds.length > 0) {
          await Application.deleteMany({ _id: { $in: orphanedAppIds } });
          console.log('Deleted', orphanedAppIds.length, 'orphaned applications');
        }
      }
      
    } catch (jobError) {
      console.error('Error fetching assigned jobs:', jobError);
      assignedJobs = [];
    }

    // Get reviews with comprehensive error handling and data validation
    console.log('Step 4: Fetching reviews...');
    let reviews = [];
    let validReviews = [];
    
    try {
      const rawReviews = await Review.find({ worker: workerId })
        .populate('employer', 'name isCompany')
        .populate('job', 'category title')
        .sort({ createdAt: -1 });
      
      console.log('Found', rawReviews.length, 'raw reviews');
      
      // Filter out reviews with missing or invalid data
      validReviews = rawReviews.filter(review => {
        if (!review.employer) {
          console.log('Filtering out review with missing employer:', review._id);
          return false;
        }
        if (typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
          console.log('Filtering out review with invalid rating:', review._id, 'rating:', review.rating);
          return false;
        }
        return true;
      });
      
      reviews = validReviews;
      console.log('Found', reviews.length, 'valid reviews');
      
      // Clean up invalid reviews
      if (rawReviews.length > validReviews.length) {
        console.log('Cleaning up invalid reviews...');
        const invalidReviewIds = rawReviews
          .filter(review => !review.employer || typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5)
          .map(review => review._id);
        
        if (invalidReviewIds.length > 0) {
          await Review.deleteMany({ _id: { $in: invalidReviewIds } });
          console.log('Deleted', invalidReviewIds.length, 'invalid reviews');
        }
      }
      
    } catch (reviewError) {
      console.error('Error fetching reviews:', reviewError);
      reviews = [];
    }

    // Calculate average rating with validation
    const validRatings = reviews.filter(review => 
      typeof review.rating === 'number' && review.rating >= 1 && review.rating <= 5
    );
    const averageRating = validRatings.length > 0 
      ? validRatings.reduce((sum, review) => sum + review.rating, 0) / validRatings.length 
      : 0;

    // Format job history with comprehensive error handling
    console.log('Step 5: Formatting job history...');
    let jobHistory = [];
    
    try {
      jobHistory = await Promise.all(assignedJobs.map(async (app, index) => {
        try {
          // Validate all required fields before processing
          if (!app.job || !app.job.employer) {
            console.log(`Skipping job ${index + 1} due to missing data`);
            return null;
          }
          
          console.log(`Processing job ${index + 1}:`, app.job.title || 'No title');
          
          // Find review for this job safely
          const jobReview = reviews.find(review => 
            review.job && app.job && review.job._id.toString() === app.job._id.toString()
          );

          return {
            jobId: app.job._id || 'unknown',
            jobTitle: app.job.title || `${app.job.category || 'Unknown'} Position`,
            jobCategory: app.job.category || 'Unknown',
            employerName: app.job.employer.name || 'Unknown Employer',
            isCompany: Boolean(app.job.employer.isCompany),
            status: app.status || 'unknown',
            assignedDate: app.updatedAt || app.createdAt || new Date(),
            salary: app.job.salary || app.job.salaryRange || 'Not specified',
            location: app.job.location || app.job.address || 'Not specified',
            review: jobReview && typeof jobReview.rating === 'number' && jobReview.rating >= 1 && jobReview.rating <= 5 ? {
              rating: jobReview.rating,
              comment: jobReview.comment || '',
              reviewDate: jobReview.createdAt
            } : null
          };
        } catch (error) {
          console.error(`Error processing job ${index + 1}:`, error);
          return null; // Return null instead of error object
        }
      }));
      
      // Filter out null results
      jobHistory = jobHistory.filter(job => job !== null);
      console.log('Job history formatted successfully:', jobHistory.length, 'valid jobs');
      
    } catch (historyError) {
      console.error('Error formatting job history:', historyError);
      jobHistory = [];
    }

    // Create worker profile with comprehensive data validation
    console.log('Step 6: Creating worker profile object...');
    
    // Ensure all required fields have safe defaults
    const safeWorkerData = {
      _id: worker._id,
      name: worker.name || 'Unknown Worker',
      contact: worker.contact || 'Not provided',
      address: worker.address || 'Not provided',
      dob: worker.dob || null,
      sex: worker.sex || 'Not specified',
      role: worker.role || 'worker',
      jobPreferences: Array.isArray(worker.jobPreferences) ? worker.jobPreferences : [],
      availability: worker.availability || 'Not specified',
      workHistory: worker.workHistory || '',
      isNidVerified: Boolean(worker.isNidVerified),
      reportedCount: Number(worker.reportedCount) || 0,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt
    };
    
    const workerProfile = {
      ...safeWorkerData,
      jobHistory: jobHistory,
      reviews: {
        total: reviews.length,
        averageRating: Math.round(Math.max(0, Math.min(5, averageRating)) * 10) / 10, // Ensure rating is between 0-5
        recentReviews: reviews.slice(0, 5).map(review => ({
          _id: review._id,
          rating: Math.max(1, Math.min(5, review.rating || 0)), // Ensure rating is between 1-5
          comment: review.comment || '',
          createdAt: review.createdAt,
          employer: {
            _id: review.employer._id,
            name: review.employer.name || 'Unknown Employer',
            isCompany: Boolean(review.employer.isCompany)
          },
          job: review.job ? {
            _id: review.job._id,
            category: review.job.category || 'Unknown',
            title: review.job.title || 'Unknown Job'
          } : null
        }))
      }
    };

    console.log('Step 7: Sending response for worker:', worker.name);
    res.json(workerProfile);
  } catch (err) {
    console.error('Get worker profile error:', err);
    console.error('Error stack:', err.stack);
    console.error('Worker ID that failed:', req.params.workerId);
    res.status(500).json({ 
      error: 'Failed to fetch worker profile',
      details: err.message,
      workerId: req.params.workerId
    });
  }
};
