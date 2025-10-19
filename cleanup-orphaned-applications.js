const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/labournet');

// Import models
const Application = require('./models/Application');
const Job = require('./models/Job');

async function cleanupOrphanedApplications() {
  try {
    console.log('Cleaning up orphaned applications...');
    
    // Find all applications
    const applications = await Application.find({});
    console.log(`Found ${applications.length} total applications`);
    
    let deletedCount = 0;
    
    for (const app of applications) {
      // Check if the job exists
      const jobExists = await Job.findById(app.job);
      
      if (!jobExists) {
        console.log(`Deleting orphaned application:`, {
          appId: app._id,
          jobId: app.job,
          worker: app.worker,
          status: app.status
        });
        
        await Application.findByIdAndDelete(app._id);
        deletedCount++;
        console.log('✅ Deleted orphaned application');
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Total applications processed: ${applications.length}`);
    console.log(`- Orphaned applications deleted: ${deletedCount}`);
    console.log(`- Remaining applications: ${applications.length - deletedCount}`);
    
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

cleanupOrphanedApplications();
