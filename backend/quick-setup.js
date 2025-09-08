const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

async function quickSetup() {
  try {
    console.log('🚀 Starting quick setup...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear and recreate users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      // Employers
      {
        role: 'employer',
        name: 'Rafiq Khan',
        contact: '+8801987654321',
        address: 'Chittagong, Bangladesh',
        dob: new Date('1980-03-20'),
        sex: 'male',
        password: hashedPassword,
        isCompany: false,
        hiringPreferences: 'Looking for reliable workers',
        isNidVerified: true,
        nidNumber: '9876543210987'
      },
      // Workers
      {
        role: 'worker',
        name: 'Navil Hossain Chowdhury',
        contact: '+8801234567890',
        address: 'Dhaka, Bangladesh',
        dob: new Date('1995-06-15'),
        sex: 'male',
        password: hashedPassword,
        jobPreferences: ['Cleaning', 'Cooking', 'Painting'],
        availability: 'full-time',
        workHistory: 'Experienced in household work',
        isNidVerified: true,
        nidNumber: '1234567890123'
      },
      {
        role: 'worker',
        name: 'Ahmed Hassan',
        contact: '+8801711111111',
        address: 'Dhaka, Bangladesh',
        dob: new Date('1992-05-15'),
        sex: 'male',
        password: hashedPassword,
        jobPreferences: ['Plumbing', 'Electrical'],
        availability: 'full-time',
        workHistory: 'Experienced plumber with 5 years experience',
        isNidVerified: true,
        nidNumber: '1111111111111'
      },
      {
        role: 'worker',
        name: 'Fatima Rahman',
        contact: '+8801722222222',
        address: 'Chittagong, Bangladesh',
        dob: new Date('1988-08-20'),
        sex: 'female',
        password: hashedPassword,
        jobPreferences: ['Cleaning', 'Cooking'],
        availability: 'part-time',
        workHistory: 'Professional house cleaner and cook',
        isNidVerified: true,
        nidNumber: '2222222222222'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.name}`);
    }

    const workerCount = await User.countDocuments({ role: 'worker' });
    const employerCount = await User.countDocuments({ role: 'employer' });
    
    console.log(`\n📊 Setup complete:`);
    console.log(`   Workers: ${workerCount}`);
    console.log(`   Employers: ${employerCount}`);
    console.log(`\n🔑 Login credentials (password123 for all):`);
    console.log(`   Employer: Rafiq Khan`);
    console.log(`   Worker: Navil Hossain Chowdhury`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

quickSetup();
