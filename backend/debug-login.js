const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

// Set environment variables
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/labour-net';

async function debugLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB:', process.env.MONGO_URI);

    // Check all databases
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });

    // Check collections in current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in labour-net database:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });

    // List all users
    const users = await User.find({}, 'name role');
    console.log('\nAll users in database:');
    users.forEach(user => {
      console.log(`- Name: "${user.name}", Role: ${user.role}, ID: ${user._id}`);
    });

    // Check if there are any users
    if (users.length === 0) {
      console.log('\nNo users found in database. Creating test users...');
      
      // Create test users
      const testUsers = [
        {
          role: 'worker',
          name: 'Navil Hossain Chowdhury',
          contact: '1234567890',
          address: 'Test Address',
          dob: new Date('1990-01-01'),
          sex: 'male',
          password: await bcrypt.hash('password123', 10),
          jobPreferences: ['Cleaning'],
          availability: 'full-time',
          workHistory: 'Test work history',
          isNidVerified: true,
          nidNumber: '1234567890123'
        },
        {
          role: 'employer',
          name: 'Rafiq Khan',
          contact: '0987654321',
          address: 'Employer Address',
          dob: new Date('1985-01-01'),
          sex: 'male',
          password: await bcrypt.hash('password123', 10),
          isCompany: false,
          hiringPreferences: 'Experienced workers',
          isNidVerified: true,
          nidNumber: '9876543210987'
        }
      ];

      for (const userData of testUsers) {
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${user.name}`);
      }
    } else {
      console.log(`\nTotal users: ${users.length}`);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

debugLogin();
