const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/labournet');

// Import models
const Job = require('./models/Job');

async function checkJobDocument() {
  try {
    console.log('Checking specific job document...');
    
    const jobId = '68f11ae46691b911d085a639'; // Ahad Munshi's job ID
    
    // Find the job directly
    console.log('\n1. Finding job document directly...');
    const job = await Job.findById(jobId);
    
    if (job) {
      console.log('✅ Job found in database');
      console.log('Job data:', {
        id: job._id,
        title: job.title,
        category: job.category,
        employer: job.employer,
        salary: job.salary,
        salaryRange: job.salaryRange,
        location: job.location,
        address: job.address,
        description: job.description,
        status: job.status,
        createdAt: job.createdAt
      });
      
      // Check if employer exists
      console.log('\n2. Checking employer...');
      const User = require('./models/user');
      const employer = await User.findById(job.employer);
      
      if (employer) {
        console.log('✅ Employer found:', {
          id: employer._id,
          name: employer.name,
          isCompany: employer.isCompany
        });
      } else {
        console.log('❌ Employer not found');
      }
      
    } else {
      console.log('❌ Job not found in database');
      
      // Let's check if there are any jobs at all
      console.log('\n2. Checking all jobs in database...');
      const allJobs = await Job.find({});
      console.log(`Found ${allJobs.length} total jobs`);
      
      if (allJobs.length > 0) {
        console.log('Sample job:', {
          id: allJobs[0]._id,
          title: allJobs[0].title,
          category: allJobs[0].category,
          employer: allJobs[0].employer
        });
      }
    }
    
  } catch (error) {
    console.error('Check failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkJobDocument();
