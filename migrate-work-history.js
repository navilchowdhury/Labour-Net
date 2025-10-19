const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/labournet');

// Import User model
const User = require('./models/user');

async function migrateWorkHistory() {
  try {
    console.log('Starting work history migration...');
    
    // Find all users with workHistory as array
    const users = await User.find({
      workHistory: { $exists: true, $type: 'array' }
    });
    
    console.log(`Found ${users.length} users with array workHistory`);
    
    for (const user of users) {
      console.log(`Processing user: ${user.name}`);
      console.log('Current workHistory:', user.workHistory);
      
      // Convert array to string
      let workHistoryString = '';
      if (Array.isArray(user.workHistory)) {
        // Join array elements with newlines, filtering out empty strings
        workHistoryString = user.workHistory
          .filter(item => item && item.trim() !== '')
          .join('\n');
      }
      
      console.log('Converted workHistory:', workHistoryString);
      
      // Update the user
      await User.findByIdAndUpdate(user._id, {
        workHistory: workHistoryString
      });
      
      console.log(`Updated user: ${user.name}`);
    }
    
    console.log('Migration completed successfully!');
    
    // Verify the migration
    console.log('\nVerifying migration...');
    const updatedUsers = await User.find({});
    updatedUsers.forEach(user => {
      if (user.workHistory !== undefined) {
        console.log(`${user.name}: workHistory type = ${typeof user.workHistory}, value = "${user.workHistory}"`);
      }
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateWorkHistory();
