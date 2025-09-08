const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Check all users in the database
    const users = await User.find({}, 'name role createdAt');
    console.log(`\n📊 Found ${users.length} users in database:`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('This explains why login is failing.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name: "${user.name}" | Role: ${user.role} | Created: ${user.createdAt}`);
      });
    }

    // Check for your specific users
    const navilUser = await User.findOne({ name: 'Navil Hossain Chowdhury' });
    const rafiqUser = await User.findOne({ name: 'Rafiq Khan' });

    console.log('\n🔍 Checking specific users:');
    console.log(`Navil Hossain Chowdhury: ${navilUser ? '✅ Found' : '❌ Not found'}`);
    console.log(`Rafiq Khan: ${rafiqUser ? '✅ Found' : '❌ Not found'}`);

    if (!navilUser && !rafiqUser) {
      console.log('\n💡 Solution: Your users are missing from the database.');
      console.log('You need to register these accounts again or restore from backup.');
    }

    await mongoose.disconnect();
    console.log('\n✅ Database check complete');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 MongoDB server is not running. Please start MongoDB first.');
    }
  }
}

checkDatabase();
