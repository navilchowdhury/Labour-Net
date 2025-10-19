const axios = require('axios');

async function checkJobsAndAssign() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Checking jobs and testing assignment...');
    
    // Login as employer
    const employerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestEmployer123',
      password: 'password123'
    });
    const employerToken = employerLogin.data.token;
    console.log('✅ Employer logged in');
    
    // Login as worker
    const workerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestWorker123',
      password: 'password123'
    });
    const workerToken = workerLogin.data.token;
    const workerId = workerLogin.data.user.id;
    console.log('✅ Worker logged in');
    
    // Check all jobs
    console.log('\n1. Checking all jobs...');
    const jobsResponse = await axios.get(`${baseURL}/jobs`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('Total jobs:', jobsResponse.data.length);
    
    // Show first few jobs with their owners
    console.log('\nFirst 5 jobs:');
    jobsResponse.data.slice(0, 5).forEach((job, index) => {
      console.log(`${index + 1}. "${job.title}" - Owner: ${job.employer.name} (${job.employer.role}) - Status: ${job.status}`);
    });
    
    // Find a job that's open and has applications
    console.log('\n2. Looking for jobs with applications...');
    let jobWithApplications = null;
    
    for (const job of jobsResponse.data.slice(0, 10)) {
      try {
        const applicationsResponse = await axios.get(`${baseURL}/applications/job/${job._id}`, {
          headers: { Authorization: `Bearer ${employerToken}` }
        });
        
        if (applicationsResponse.data.length > 0) {
          console.log(`Job "${job.title}" has ${applicationsResponse.data.length} applications`);
          jobWithApplications = job;
          break;
        }
      } catch (error) {
        // Job might not be accessible, continue
      }
    }
    
    if (!jobWithApplications) {
      console.log('No jobs with applications found. Creating a test job...');
      
      // Create a test job
      const newJobResponse = await axios.post(`${baseURL}/jobs`, {
        title: 'Test Experience Job',
        category: 'plumbing',
        description: 'Test job for experience tracking',
        workingHours: '8 hours',
        salary: '5000 BDT',
        location: 'Dhaka',
        status: 'open'
      }, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      
      jobWithApplications = newJobResponse.data;
      console.log('✅ Created test job:', jobWithApplications.title);
    }
    
    // Check worker's current job experience
    console.log('\n3. Checking worker\'s current job experience...');
    const beforeProfile = await axios.get(`${baseURL}/auth/worker/${workerId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('Before assignment - Job History length:', beforeProfile.data.jobHistory?.length || 0);
    
    // Apply for the job if not already applied
    console.log('\n4. Applying for job...');
    try {
      await axios.post(`${baseURL}/applications/apply`, {
        jobId: jobWithApplications._id,
        message: 'Test application for experience tracking'
      }, {
        headers: { Authorization: `Bearer ${workerToken}` }
      });
      console.log('✅ Applied for job');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('already applied')) {
        console.log('✅ Already applied for this job');
      } else {
        console.log('❌ Application failed:', error.response?.data);
        return;
      }
    }
    
    // Assign the worker to the job
    console.log('\n5. Assigning worker to job...');
    try {
      await axios.post(`${baseURL}/applications/assign`, {
        jobId: jobWithApplications._id,
        workerId: workerId
      }, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      console.log('✅ Worker assigned successfully');
    } catch (error) {
      console.log('❌ Assignment failed:', error.response?.data);
      return;
    }
    
    // Check worker's job experience after assignment
    console.log('\n6. Checking worker\'s job experience after assignment...');
    const afterProfile = await axios.get(`${baseURL}/auth/worker/${workerId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('After assignment - Job History length:', afterProfile.data.jobHistory?.length || 0);
    
    if (afterProfile.data.jobHistory?.length > 0) {
      console.log('✅ Job experience updated successfully!');
      const job = afterProfile.data.jobHistory[0];
      console.log('Job details:', {
        title: job.jobTitle,
        category: job.jobCategory,
        employer: job.employerName,
        status: job.status,
        assignedDate: job.assignedDate
      });
    } else {
      console.log('❌ Job experience not updated');
      
      // Debug: Check application status
      console.log('\n7. Debugging - Checking application status...');
      const applicationsResponse = await axios.get(`${baseURL}/applications/job/${jobWithApplications._id}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      
      const workerApp = applicationsResponse.data.find(app => 
        app.worker._id === workerId
      );
      
      if (workerApp) {
        console.log('Application found:', {
          id: workerApp._id,
          status: workerApp.status,
          appliedAt: workerApp.appliedAt,
          assignedAt: workerApp.assignedAt
        });
      } else {
        console.log('Application not found');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

checkJobsAndAssign();

