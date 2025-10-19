const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:5000/api/auth';
  
  try {
    console.log('Testing API endpoints...');
    
    // Test 1: Register a test user
    console.log('\n1. Testing user registration...');
    const registerData = {
      role: 'worker',
      name: 'TestWorker123',
      contact: '1234567890',
      address: 'Test Address',
      dob: '1990-01-01',
      sex: 'male',
      password: 'password123',
      jobPreferences: ['plumbing', 'electrical'],
      availability: 'full-time',
      workHistory: 'Test work history'
    };
    
    try {
      const registerResponse = await axios.post(`${baseURL}/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (error) {
      console.log('⚠️ Registration error (user might exist):', error.response?.data || error.message);
    }
    
    // Test 2: Login
    console.log('\n2. Testing user login...');
    try {
      const loginResponse = await axios.post(`${baseURL}/login`, {
        name: 'TestWorker123',
        password: 'password123'
      });
      console.log('✅ Login successful');
      console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
      console.log('User data:', loginResponse.data.user?.name);
      
      const token = loginResponse.data.token;
      
      // Test 3: Search workers (as employer)
      console.log('\n3. Testing worker search...');
      try {
        const searchResponse = await axios.get(`${baseURL}/search-workers?jobCategory=plumbing`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Search successful - Found', searchResponse.data.length, 'workers');
        console.log('Workers:', searchResponse.data.map(w => ({ name: w.name, jobPreferences: w.jobPreferences })));
      } catch (error) {
        console.log('❌ Search error:', error.response?.data || error.message);
      }
      
    } catch (error) {
      console.log('❌ Login error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
