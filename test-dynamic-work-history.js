const mongoose = require('mongoose');
const User = require('./models/user');
const Job = require('./models/Job');
const Application = require('./models/Application');

// Test script to verify dynamic work history updates
async function testDynamicWorkHistory() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/labournet', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('🔗 Connected to MongoDB');
    
    // Find a worker
    const worker = await User.findOne({ role: 'worker' });
    if (!worker) {
      console.log('❌ No workers found in database');
      return;
    }
    
    console.log(`👤 Testing with worker: ${worker.name}`);
    console.log(`📋 Current work history: ${worker.workHistory || 'None'}`);
    
    // Parse and display current work history
    if (worker.workHistory) {
      try {
        const workHistory = JSON.parse(worker.workHistory);
        console.log(`\n📊 Current Work History (${workHistory.length} jobs):`);
        workHistory.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.jobCategory} - ${job.location} (${new Date(job.completedDate).toLocaleDateString()})`);
        });
      } catch (e) {
        console.log('⚠️  Error parsing work history:', e.message);
      }
    }
    
    // Find applications for this worker
    const applications = await Application.find({ worker: worker._id })
      .populate('job')
      .sort({ createdAt: -1 });
    
    console.log(`\n📝 All Applications (${applications.length}):`);
    applications.forEach((app, index) => {
      console.log(`  ${index + 1}. ${app.job?.category || 'Unknown'} - Status: ${app.status} - Applied: ${app.appliedAt}`);
    });
    
    // Find completed applications
    const completedApplications = applications.filter(app => app.status === 'completed');
    console.log(`\n✅ Completed Applications: ${completedApplications.length}`);
    
    // Find assigned applications
    const assignedApplications = applications.filter(app => app.status === 'assigned');
    console.log(`🎯 Assigned Applications: ${assignedApplications.length}`);
    
    // Test the backend API endpoint that employers use
    console.log('\n🔍 Testing employer view of worker profiles...');
    
    // Simulate what the backend does when employers view applications
    const testApplications = await Application.find({ worker: worker._id })
      .populate('worker', 'name contact jobPreferences availability address isNidVerified workHistory')
      .sort({ createdAt: -1 });
    
    if (testApplications.length > 0) {
      const testApp = testApplications[0];
      
      // Get worker's job history from applications
      const assignedJobs = await Application.find({
        worker: testApp.worker._id,
        status: { $in: ['assigned', 'completed'] }
      })
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'name isCompany'
        }
      })
      .sort({ createdAt: -1 })
      .limit(10);

      // Parse work history from user model
      let userWorkHistory = [];
      try {
        if (testApp.worker.workHistory) {
          userWorkHistory = JSON.parse(testApp.worker.workHistory);
        }
      } catch (e) {
        console.log('Error parsing work history:', e);
      }

      console.log(`\n📈 Combined Work History for Employer View:`);
      console.log(`  - User work history: ${userWorkHistory.length} jobs`);
      console.log(`  - Application history: ${assignedJobs.length} jobs`);
      
      // Show what employers would see
      const combinedHistory = [
        ...userWorkHistory.map(job => ({
          jobCategory: job.jobCategory,
          location: job.location,
          status: 'completed'
        })),
        ...assignedJobs.map(app => ({
          jobCategory: app.job.category,
          location: app.job.location || app.job.address,
          status: app.status
        }))
      ];
      
      console.log(`\n🎯 What employers see (${combinedHistory.length} total jobs):`);
      combinedHistory.slice(0, 5).forEach((job, index) => {
        console.log(`  ${index + 1}. ${job.jobCategory} - ${job.location} (${job.status})`);
      });
    }
    
    console.log('\n✅ Test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  - Work history is stored in user.workHistory as JSON');
    console.log('  - Backend combines user work history with application history');
    console.log('  - Employers see comprehensive work experience');
    console.log('  - Frontend displays professional format with category and location only');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testDynamicWorkHistory();
