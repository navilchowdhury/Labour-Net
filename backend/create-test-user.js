const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

// Set environment variables
process.env.MONGO_URI = 'mongodb://localhost:27017/labour-net';

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create a test user with known credentials
    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const testUser = new User({
      role: 'worker',
      name: 'testuser',
      contact: '1234567890',
      address: 'Test Address',
      dob: new Date('1990-01-01'),
      sex: 'male',
      password: hashedPassword,
      jobPreferences: ['Cleaning'],
      availability: 'full-time',
      workHistory: 'Test work history',
      isNidVerified: true,
      nidNumber: '1234567890123'
    });

    // Check if user already exists
    const existingUser = await User.findOne({ name: 'testuser' });
    if (existingUser) {
      console.log('Test user already exists. Updating password...');
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log('Test user password updated successfully');
    } else {
      await testUser.save();
      console.log('Test user created successfully');
    }

    console.log('\nTest credentials:');
    console.log('Username: testuser');
    console.log('Password: password123');
    console.log('Role: worker');

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestUser();
