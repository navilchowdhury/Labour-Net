const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/labournet');

// Import models
const Application = require('./models/Application');
const Job = require('./models/Job');

async function fixOrphanedApplications() {
  try {
    console.log('Fixing orphaned applications...');
    
    // Find all applications
    console.log('\n1. Finding all applications...');
    const applications = await Application.find({});
    console.log(`Found ${applications.length} total applications`);
    
    let orphanedCount = 0;
    let fixedCount = 0;
    
    for (const app of applications) {
      // Check if the job exists
      const jobExists = await Job.findById(app.job);
      
      if (!jobExists) {
        console.log(`\nOrphaned application found:`, {
          appId: app._id,
          jobId: app.job,
          worker: app.worker,
          status: app.status
        });
        
        orphanedCount++;
        
        // Option 1: Delete the orphaned application
        // await Application.findByIdAndDelete(app._id);
        // console.log('Deleted orphaned application');
        // fixedCount++;
        
        // Option 2: Update the application to remove the job reference
        // await Application.findByIdAndUpdate(app._id, { job: null });
        // console.log('Updated application to remove job reference');
        // fixedCount++;
        
        // Option 3: Keep it but mark it differently (current approach)
        console.log('Keeping orphaned application (will show as "Error loading job details")');
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Total applications: ${applications.length}`);
    console.log(`- Orphaned applications: ${orphanedCount}`);
    console.log(`- Fixed applications: ${fixedCount}`);
    
    // Let's also check if there are any applications with missing workers
    console.log('\n2. Checking for applications with missing workers...');
    const User = require('./models/user');
    
    for (const app of applications.slice(0, 5)) { // Check first 5 applications
      const workerExists = await User.findById(app.worker);
      if (!workerExists) {
        console.log(`Application with missing worker:`, {
          appId: app._id,
          workerId: app.worker,
          jobId: app.job
        });
      }
    }
    
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixOrphanedApplications();
