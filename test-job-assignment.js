const axios = require('axios');

async function testJobAssignment() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Testing job assignment and experience updates...');
    
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
    
    // Check worker's current job experience
    console.log('\n1. Checking worker\'s current job experience...');
    const beforeProfile = await axios.get(`${baseURL}/auth/worker/${workerId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('Before assignment - Job History length:', beforeProfile.data.jobHistory?.length || 0);
    
    // Check if there are any jobs available to assign
    console.log('\n2. Checking available jobs...');
    const jobsResponse = await axios.get(`${baseURL}/jobs`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('Available jobs:', jobsResponse.data.length);
    
    if (jobsResponse.data.length === 0) {
      console.log('No jobs available to test assignment');
      return;
    }
    
    // Find a job that belongs to the employer
    const employerJobs = jobsResponse.data.filter(job => job.employer._id === employerLogin.data.user.id);
    console.log('Employer\'s jobs:', employerJobs.length);
    
    if (employerJobs.length === 0) {
      console.log('No jobs owned by this employer to test assignment');
      return;
    }
    
    const testJob = employerJobs[0];
    console.log('Using job:', testJob.title, 'Status:', testJob.status);
    
    // Check if worker has applied to this job
    console.log('\n3. Checking worker\'s applications...');
    const workerApplications = await axios.get(`${baseURL}/applications/worker`, {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    console.log('Worker applications:', workerApplications.data.length);
    
    const jobApplication = workerApplications.data.find(app => 
      app.job._id === testJob._id
    );
    
    if (!jobApplication) {
      console.log('Worker has not applied to this job. Creating application...');
      
      // Create an application
      await axios.post(`${baseURL}/applications/apply`, {
        jobId: testJob._id,
        message: 'Test application for experience tracking'
      }, {
        headers: { Authorization: `Bearer ${workerToken}` }
      });
      console.log('✅ Application created');
    } else {
      console.log('Worker has already applied to this job. Status:', jobApplication.status);
    }
    
    // Now assign the worker to the job
    console.log('\n4. Assigning worker to job...');
    try {
      await axios.post(`${baseURL}/applications/assign`, {
        jobId: testJob._id,
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
    console.log('\n5. Checking worker\'s job experience after assignment...');
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
        status: job.status
      });
    } else {
      console.log('❌ Job experience not updated');
    }
    
    // Check the application status directly
    console.log('\n6. Checking application status directly...');
    const applicationsResponse = await axios.get(`${baseURL}/applications/job/${testJob._id}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    const workerApp = applicationsResponse.data.find(app => 
      app.worker._id === workerId
    );
    
    if (workerApp) {
      console.log('Application status:', workerApp.status);
      console.log('Application details:', {
        id: workerApp._id,
        status: workerApp.status,
        appliedAt: workerApp.appliedAt,
        assignedAt: workerApp.assignedAt
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testJobAssignment();

