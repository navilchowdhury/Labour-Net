const Shift = require('../models/Shift');

// Get all shifts for a worker
exports.getWorkerShifts = async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can view shifts' });
    }

    const shifts = await Shift.find({ worker: req.user.id });
    
    // Group shifts by day
    const groupedShifts = {};
    shifts.forEach(shift => {
      if (!groupedShifts[shift.day]) {
        groupedShifts[shift.day] = [];
      }
      groupedShifts[shift.day].push(shift);
    });

    res.json(groupedShifts);
  } catch (err) {
    console.error('Get shifts error:', err);
    res.status(500).json({ error: 'Failed to fetch shifts' });
  }
};

// Create a new shift
exports.createShift = async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can create shifts' });
    }

    const { day, startTime, endTime, jobTitle, address, description, contactPerson, phone } = req.body;

    const shift = new Shift({
      worker: req.user.id,
      day,
      startTime,
      endTime,
      jobTitle,
      address,
      description,
      contactPerson,
      phone
    });

    await shift.save();
    res.status(201).json(shift);
  } catch (err) {
    console.error('Create shift error:', err);
    res.status(500).json({ error: 'Failed to create shift' });
  }
};

// Update a shift
exports.updateShift = async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can update shifts' });
    }

    const { shiftId } = req.params;
    const updates = req.body;

    const shift = await Shift.findOne({ _id: shiftId, worker: req.user.id });
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    Object.assign(shift, updates);
    await shift.save();

    res.json(shift);
  } catch (err) {
    console.error('Update shift error:', err);
    res.status(500).json({ error: 'Failed to update shift' });
  }
};

// Delete a shift
exports.deleteShift = async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can delete shifts' });
    }

    const { shiftId } = req.params;

    const shift = await Shift.findOne({ _id: shiftId, worker: req.user.id });
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    await Shift.findByIdAndDelete(shiftId);
    res.json({ message: 'Shift deleted successfully' });
  } catch (err) {
    console.error('Delete shift error:', err);
    res.status(500).json({ error: 'Failed to delete shift' });
  }
};
