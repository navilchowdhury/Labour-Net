const axios = require('axios');

async function testJobExperience() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Testing job experience data...');
    
    // Login as employer
    const employerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestEmployer123',
      password: 'password123'
    });
    const employerToken = employerLogin.data.token;
    
    // Get Ahad Munshi's profile
    console.log('\n1. Getting Ahad Munshi profile...');
    const ahadProfile = await axios.get(`${baseURL}/auth/worker/68f116b45ef1cb38ab285b50`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    console.log('✅ Ahad Munshi profile retrieved');
    console.log('Job History length:', ahadProfile.data.jobHistory?.length || 0);
    console.log('Job History:', JSON.stringify(ahadProfile.data.jobHistory, null, 2));
    
    // Get TestWorker123's profile for comparison
    console.log('\n2. Getting TestWorker123 profile...');
    const testWorkerProfile = await axios.get(`${baseURL}/auth/worker/68f1154746fd02819b53bc18`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    console.log('✅ TestWorker123 profile retrieved');
    console.log('Job History length:', testWorkerProfile.data.jobHistory?.length || 0);
    console.log('Job History:', JSON.stringify(testWorkerProfile.data.jobHistory, null, 2));
    
    // Check all workers' job experience
    console.log('\n3. Checking all workers for job experience...');
    const searchResponse = await axios.get(`${baseURL}/auth/search-workers`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    for (const worker of searchResponse.data.slice(0, 5)) {
      console.log(`\nChecking ${worker.name}...`);
      try {
        const workerProfile = await axios.get(`${baseURL}/auth/worker/${worker._id}`, {
          headers: { Authorization: `Bearer ${employerToken}` }
        });
        
        const jobHistory = workerProfile.data.jobHistory || [];
        console.log(`✅ ${worker.name} has ${jobHistory.length} job(s) in history`);
        
        if (jobHistory.length > 0) {
          console.log('Job details:', jobHistory.map(job => ({
            title: job.jobTitle,
            category: job.jobCategory,
            employer: job.employerName,
            status: job.status
          })));
        }
      } catch (error) {
        console.log(`❌ Error getting ${worker.name} profile:`, error.response?.data);
      }
    }
    
    // Let's also check the Application model directly to see if there are any applications for Ahad Munshi
    console.log('\n4. Checking Application model directly...');
    
    // We need to check if there are any applications in the database
    // This would require a direct database query, but let's see if we can get more info
    console.log('Note: To check applications directly, we would need database access');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testJobExperience();
