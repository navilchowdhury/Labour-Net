// routes/nid.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyNid, verifyAndUpdateUserNid } = require('../controllers/nidController');
const auth = require('../middleware/auth');

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Public verify endpoint (registration step)
router.post("/verify-nid", upload.single("nidPhoto"), verifyNid);

// Authenticated verify-and-update (Profile -> re-verify)
router.post('/verify-and-update', auth, upload.single('nidPhoto'), verifyAndUpdateUserNid);

module.exports = router;

