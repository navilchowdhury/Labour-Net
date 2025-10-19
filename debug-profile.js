const axios = require('axios');

async function debugProfile() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Debugging Ahad Munshi profile issue...');
    
    // Login as employer
    const employerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestEmployer123',
      password: 'password123'
    });
    const employerToken = employerLogin.data.token;
    
    const ahadId = '68f116b45ef1cb38ab285b50';
    
    // Test the exact endpoint that's failing
    console.log('\nTesting getWorkerProfile endpoint...');
    try {
      const response = await axios.get(`${baseURL}/auth/worker/${ahadId}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      console.log('✅ Profile retrieved successfully');
      console.log('Job history length:', response.data.jobHistory ? response.data.jobHistory.length : 0);
    } catch (error) {
      console.log('❌ Error details:');
      console.log('- Status:', error.response?.status);
      console.log('- Status Text:', error.response?.statusText);
      console.log('- Error Message:', error.response?.data);
      console.log('- Full Error:', error.message);
    }
    
    // Let's also test with a worker that we know works
    console.log('\nTesting with TestWorker123 (known working)...');
    try {
      const testWorkerResponse = await axios.get(`${baseURL}/auth/worker/68f1154746fd02819b53bc18`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      console.log('✅ TestWorker123 profile retrieved successfully');
      console.log('Job history length:', testWorkerResponse.data.jobHistory ? testWorkerResponse.data.jobHistory.length : 0);
    } catch (error) {
      console.log('❌ TestWorker123 also failed:', error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
  }
}

debugProfile();
