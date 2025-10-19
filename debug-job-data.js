const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/labournet');

// Import models
const User = require('./models/user');
const Application = require('./models/Application');
const Job = require('./models/Job');

async function debugJobData() {
  try {
    console.log('Debugging job data for Ahad Munshi...');
    
    const ahadId = '68f116b45ef1cb38ab285b50';
    
    // Find applications for Ahad Munshi
    console.log('\n1. Finding applications for Ahad Munshi...');
    const applications = await Application.find({
      worker: ahadId,
      status: { $in: ['assigned', 'completed'] }
    });
    
    console.log(`Found ${applications.length} applications for Ahad Munshi`);
    
    for (const app of applications) {
      console.log('\nApplication:', {
        id: app._id,
        job: app.job,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt
      });
      
      // Try to populate the job
      console.log('Populating job data...');
      try {
        await app.populate({
          path: 'job',
          populate: {
            path: 'employer',
            select: 'name isCompany'
          }
        });
        
        console.log('Job populated successfully:', {
          jobId: app.job?._id,
          jobTitle: app.job?.title,
          jobCategory: app.job?.category,
          employer: app.job?.employer,
          salary: app.job?.salary,
          location: app.job?.location
        });
      } catch (populateError) {
        console.error('Error populating job:', populateError);
        
        // Check if the job exists
        if (app.job) {
          console.log('Checking if job exists in database...');
          const jobExists = await Job.findById(app.job);
          console.log('Job exists:', !!jobExists);
          
          if (jobExists) {
            console.log('Job data:', {
              id: jobExists._id,
              title: jobExists.title,
              category: jobExists.category,
              employer: jobExists.employer,
              salary: jobExists.salary,
              location: jobExists.location
            });
          } else {
            console.log('Job does not exist in database!');
          }
        } else {
          console.log('No job ID in application');
        }
      }
    }
    
    // Compare with Rana Huq who has working job experience
    console.log('\n2. Checking Rana Huq for comparison...');
    const ranaId = '68f10a4a26ea0d3af442d8dd'; // From previous output
    const ranaApplications = await Application.find({
      worker: ranaId,
      status: { $in: ['assigned', 'completed'] }
    });
    
    console.log(`Found ${ranaApplications.length} applications for Rana Huq`);
    
    for (const app of ranaApplications) {
      console.log('\nRana Application:', {
        id: app._id,
        job: app.job,
        status: app.status
      });
      
      try {
        await app.populate({
          path: 'job',
          populate: {
            path: 'employer',
            select: 'name isCompany'
          }
        });
        
        console.log('Rana Job populated successfully:', {
          jobId: app.job?._id,
          jobTitle: app.job?.title,
          jobCategory: app.job?.category,
          employer: app.job?.employer
        });
      } catch (error) {
        console.error('Error populating Rana job:', error);
      }
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugJobData();
