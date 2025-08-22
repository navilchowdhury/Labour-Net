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
    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

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
    const { name, contact, address, dob, sex, jobPreferences, availability, workHistory, jobTypes, hiringPreferences, isCompany } = req.body;

    // Check for name conflicts
    if (name !== req.user.name) {
      const existingUser = await User.findOne({ name, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this name already exists' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, contact, address, dob: new Date(dob), sex, jobPreferences, availability, workHistory, jobTypes, hiringPreferences, isCompany },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
