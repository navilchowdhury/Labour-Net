const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

// Migration script to move address field to location field
async function migrateAddressToLocation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for migration');

    // Find all users that have an address field but no location field
    const usersToUpdate = await User.find({
      address: { $exists: true, $ne: null, $ne: '' },
      $or: [
        { location: { $exists: false } },
        { location: null },
        { location: '' }
      ]
    });

    console.log(`Found ${usersToUpdate.length} users to migrate`);

    let updatedCount = 0;
    for (const user of usersToUpdate) {
      // Copy address to location field
      await User.updateOne(
        { _id: user._id },
        { 
          $set: { location: user.address },
          $unset: { address: 1 }
        }
      );
      updatedCount++;
      console.log(`Updated user ${user.name}: "${user.address}" -> location`);
    }

    // Also handle users who have both fields - prioritize address if location is empty
    const usersWithBothFields = await User.find({
      address: { $exists: true, $ne: null, $ne: '' },
      location: { $exists: true }
    });

    for (const user of usersWithBothFields) {
      if (!user.location || user.location.trim() === '') {
        await User.updateOne(
          { _id: user._id },
          { 
            $set: { location: user.address },
            $unset: { address: 1 }
          }
        );
        updatedCount++;
        console.log(`Updated user ${user.name}: merged address to location`);
      } else {
        // Just remove the address field if location already exists
        await User.updateOne(
          { _id: user._id },
          { $unset: { address: 1 } }
        );
        console.log(`Removed address field for user ${user.name} (location already exists)`);
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} users.`);
    
    // Verify the migration
    const remainingAddressFields = await User.countDocuments({ address: { $exists: true } });
    console.log(`Remaining users with address field: ${remainingAddressFields}`);
    
    const usersWithLocation = await User.countDocuments({ location: { $exists: true, $ne: null, $ne: '' } });
    console.log(`Users with location field: ${usersWithLocation}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateAddressToLocation();
}

module.exports = migrateAddressToLocation;
