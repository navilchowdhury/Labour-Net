const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

async function fixUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/labour-net');
    console.log('Connected to MongoDB');

    // Delete all existing users to start fresh
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create the exact users you've been using
    const users = [
      {
        role: 'worker',
        name: 'Navil Hossain Chowdhury',
        contact: '1234567890',
        address: 'Dhaka, Bangladesh',
        dob: new Date('1990-01-01'),
        sex: 'male',
        password: await bcrypt.hash('password123', 10),
        jobPreferences: ['Cleaning', 'Cooking'],
        availability: 'full-time',
        workHistory: 'Experienced worker',
        isNidVerified: true,
        nidNumber: '1234567890123'
      },
      {
        role: 'employer',
        name: 'Rafiq Khan',
        contact: '0987654321',
        address: 'Chittagong, Bangladesh',
        dob: new Date('1985-01-01'),
        sex: 'male',
        password: await bcrypt.hash('password123', 10),
        isCompany: false,
        hiringPreferences: 'Reliable workers',
        isNidVerified: true,
        nidNumber: '9876543210987'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${user.name} (${user.role})`);
    }

    console.log('\n🎉 Users created successfully!');
    console.log('Login credentials:');
    console.log('Username: Navil Hossain Chowdhury | Password: password123');
    console.log('Username: Rafiq Khan | Password: password123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixUsers();
