const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

async function createSampleWorkers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if workers already exist
    const existingWorkers = await User.find({ role: 'worker' });
    console.log(`Found ${existingWorkers.length} existing workers`);

    if (existingWorkers.length === 0) {
      console.log('Creating sample workers...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const sampleWorkers = [
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
        },
        {
          role: 'worker',
          name: 'Mohammad Ali',
          contact: '+8801733333333',
          address: 'Sylhet, Bangladesh',
          dob: new Date('1990-12-10'),
          sex: 'male',
          password: hashedPassword,
          jobPreferences: ['Painting', 'Cleaning'],
          availability: 'flexible',
          workHistory: 'Skilled painter and maintenance worker',
          isNidVerified: false,
          nidNumber: '3333333333333'
        },
        {
          role: 'worker',
          name: 'Rashida Begum',
          contact: '+8801744444444',
          address: 'Rajshahi, Bangladesh',
          dob: new Date('1985-03-25'),
          sex: 'female',
          password: hashedPassword,
          jobPreferences: ['Cooking', 'Cleaning'],
          availability: 'weekends',
          workHistory: 'Expert cook specializing in traditional cuisine',
          isNidVerified: true,
          nidNumber: '4444444444444'
        },
        {
          role: 'worker',
          name: 'Karim Sheikh',
          contact: '+8801755555555',
          address: 'Khulna, Bangladesh',
          dob: new Date('1993-07-18'),
          sex: 'male',
          password: hashedPassword,
          jobPreferences: ['Electrical', 'Plumbing'],
          availability: 'full-time',
          workHistory: 'Certified electrician with modern equipment',
          isNidVerified: true,
          nidNumber: '5555555555555'
        }
      ];

      for (const workerData of sampleWorkers) {
        const worker = new User(workerData);
        await worker.save();
        console.log(`✅ Created worker: ${worker.name}`);
      }

      console.log('\n🎉 Sample workers created successfully!');
    } else {
      console.log('Workers already exist in database');
    }

    // Also ensure the existing users exist
    const navilUser = await User.findOne({ name: 'Navil Hossain Chowdhury' });
    const rafiqUser = await User.findOne({ name: 'Rafiq Khan' });

    if (!navilUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const navil = new User({
        role: 'worker',
        name: 'Navil Hossain Chowdhury',
        contact: '+8801234567890',
        address: 'Dhaka, Bangladesh',
        dob: new Date('1995-06-15'),
        sex: 'male',
        password: hashedPassword,
        jobPreferences: ['Cleaning', 'Cooking', 'Painting'],
        availability: 'full-time',
        workHistory: 'Experienced in household work and maintenance',
        isNidVerified: true,
        nidNumber: '1234567890123'
      });
      await navil.save();
      console.log('✅ Created Navil Hossain Chowdhury');
    }

    if (!rafiqUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const rafiq = new User({
        role: 'employer',
        name: 'Rafiq Khan',
        contact: '+8801987654321',
        address: 'Chittagong, Bangladesh',
        dob: new Date('1980-03-20'),
        sex: 'male',
        password: hashedPassword,
        isCompany: false,
        hiringPreferences: 'Looking for reliable and experienced workers',
        isNidVerified: true,
        nidNumber: '9876543210987'
      });
      await rafiq.save();
      console.log('✅ Created Rafiq Khan');
    }

    // Final count
    const totalWorkers = await User.find({ role: 'worker' });
    console.log(`\n📊 Total workers in database: ${totalWorkers.length}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSampleWorkers();
