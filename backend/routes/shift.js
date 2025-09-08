const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getWorkerShifts,
  createShift,
  updateShift,
  deleteShift
} = require('../controllers/shiftController');

// All shift routes require authentication
router.use(auth);

// Get worker's shifts
router.get('/', getWorkerShifts);

// Create a new shift
router.post('/', createShift);

// Update a shift
router.put('/:shiftId', updateShift);

// Delete a shift
router.delete('/:shiftId', deleteShift);

module.exports = router;
