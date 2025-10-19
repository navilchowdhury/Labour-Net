const mongoose = require('mongoose');
const User = require('./models/user');
const Job = require('./models/Job');
const Application = require('./models/Application');

// Test script to verify job experience update functionality
async function testJobExperienceUpdate() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/labournet', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Find a worker with completed jobs
    const worker = await User.findOne({ role: 'worker' });
    if (!worker) {
      console.log('No workers found in database');
      return;
    }
    
    console.log(`Testing with worker: ${worker.name}`);
    console.log(`Current work history: ${worker.workHistory || 'None'}`);
    
    // Find a completed job for this worker
    const completedApplication = await Application.findOne({
      worker: worker._id,
      status: 'completed'
    }).populate('job');
    
    if (!completedApplication) {
      console.log('No completed applications found for this worker');
      return;
    }
    
    console.log(`Found completed application for job: ${completedApplication.job.title}`);
    
    // Parse and display work history
    if (worker.workHistory) {
      try {
        const workHistory = JSON.parse(worker.workHistory);
        console.log(`\nWork History (${workHistory.length} jobs):`);
        workHistory.forEach((job, index) => {
          console.log(`${index + 1}. ${job.jobTitle} - ${job.employerName} (${job.completedDate})`);
        });
      } catch (e) {
        console.log('Error parsing work history:', e.message);
      }
    }
    
    // Find applications for this worker
    const applications = await Application.find({ worker: worker._id })
      .populate('job')
      .sort({ createdAt: -1 });
    
    console.log(`\nAll Applications (${applications.length}):`);
    applications.forEach((app, index) => {
      console.log(`${index + 1}. ${app.job?.title || 'Unknown'} - Status: ${app.status} - Applied: ${app.appliedAt}`);
    });
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testJobExperienceUpdate();
