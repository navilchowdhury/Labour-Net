const axios = require('axios');

async function comprehensiveDebug() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Comprehensive debugging of Ahad Munshi profile...');
    
    // Login as employer
    const employerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestEmployer123',
      password: 'password123'
    });
    const employerToken = employerLogin.data.token;
    
    const ahadId = '68f116b45ef1cb38ab285b50';
    
    // First, let's get the raw worker data from search
    console.log('\n1. Getting worker data from search...');
    const searchResponse = await axios.get(`${baseURL}/auth/search-workers`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    const ahadData = searchResponse.data.find(w => w._id === ahadId);
    if (ahadData) {
      console.log('✅ Ahad found in search results');
      console.log('Name:', ahadData.name);
      console.log('workHistory type:', typeof ahadData.workHistory);
      console.log('workHistory value:', JSON.stringify(ahadData.workHistory));
      console.log('jobPreferences:', ahadData.jobPreferences);
      console.log('All fields:', Object.keys(ahadData));
    } else {
      console.log('❌ Ahad not found in search results');
      return;
    }
    
    // Now let's try to get the detailed profile with more specific error handling
    console.log('\n2. Attempting to get detailed profile...');
    
    // Let's try a direct database query approach by creating a test endpoint
    // But first, let's see if we can identify the exact error
    
    try {
      const response = await axios.get(`${baseURL}/auth/worker/${ahadId}`, {
        headers: { Authorization: `Bearer ${employerToken}` },
        timeout: 10000 // 10 second timeout
      });
      console.log('✅ Profile retrieved successfully');
      console.log('Response data keys:', Object.keys(response.data));
    } catch (error) {
      console.log('❌ Detailed error analysis:');
      console.log('- Status:', error.response?.status);
      console.log('- Status Text:', error.response?.statusText);
      console.log('- Response Data:', JSON.stringify(error.response?.data, null, 2));
      console.log('- Request URL:', error.config?.url);
      console.log('- Request Method:', error.config?.method);
      console.log('- Request Headers:', error.config?.headers);
    }
    
    // Let's also test with a simple worker that we know works
    console.log('\n3. Testing with a known working worker...');
    try {
      const workingWorkerId = '68f1154746fd02819b53bc18'; // TestWorker123
      const workingResponse = await axios.get(`${baseURL}/auth/worker/${workingWorkerId}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      console.log('✅ Working worker profile retrieved successfully');
      console.log('Working worker response keys:', Object.keys(workingResponse.data));
    } catch (error) {
      console.log('❌ Even working worker failed:', error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Comprehensive debug failed:', error.response?.data || error.message);
  }
}

comprehensiveDebug();
