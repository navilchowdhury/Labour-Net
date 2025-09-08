// controllers/userProfileController.js
const User = require('../models/user');               // your repo uses lowercase 'user.js'
const Application = require('../models/Application'); // your repo uses 'Application.js' (capital A)

/**
 * GET /api/applications/worker/:id/profile
 * Auth: employer only
 * Returns the worker's basic profile + job history (assigned/completed applications)
 */
exports.getWorkerProfile = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view worker profiles' });
    }

    const { id } = req.params;

    // 1) Basic worker info (include nidVerified and other public fields)
    const worker = await User.findById(id)
      .select('name contact role jobPreferences availability workHistory nidVerified createdAt');

    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // 2) Job history limited to assigned/completed apps
    const history = await Application.find({
      worker: id,
      status: { $in: ['assigned', 'completed'] } // keep in sync with statuses you use
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({
        path: 'job',
        select: 'category workingHours salaryRange address description status employer assignedWorker',
        populate: { path: 'employer', select: 'name contact' }
      });

    return res.json({ worker, history });
  } catch (err) {
    console.error('getWorkerProfile error:', err);
    return res.status(500).json({ error: 'Failed to fetch worker profile' });
  }
};
