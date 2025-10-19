const axios = require('axios');

async function compareUsers() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Comparing Ahad Munshi vs TestWorker123...');
    
    // Login as employer
    const employerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestEmployer123',
      password: 'password123'
    });
    const employerToken = employerLogin.data.token;
    
    // Get both users from search
    const searchResponse = await axios.get(`${baseURL}/auth/search-workers`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    const ahad = searchResponse.data.find(w => w.name === 'Ahad Munshi');
    const testWorker = searchResponse.data.find(w => w.name === 'TestWorker123');
    
    console.log('\n=== AHAD MUNSHI ===');
    console.log('ID:', ahad._id);
    console.log('Name:', ahad.name);
    console.log('Role:', ahad.role);
    console.log('Job Preferences:', ahad.jobPreferences);
    console.log('Work History:', JSON.stringify(ahad.workHistory));
    console.log('Availability:', ahad.availability);
    console.log('Contact:', ahad.contact);
    console.log('Address:', ahad.address);
    console.log('Is NID Verified:', ahad.isNidVerified);
    console.log('Created At:', ahad.createdAt);
    
    console.log('\n=== TESTWORKER123 ===');
    console.log('ID:', testWorker._id);
    console.log('Name:', testWorker.name);
    console.log('Role:', testWorker.role);
    console.log('Job Preferences:', testWorker.jobPreferences);
    console.log('Work History:', JSON.stringify(testWorker.workHistory));
    console.log('Availability:', testWorker.availability);
    console.log('Contact:', testWorker.contact);
    console.log('Address:', testWorker.address);
    console.log('Is NID Verified:', testWorker.isNidVerified);
    console.log('Created At:', testWorker.createdAt);
    
    console.log('\n=== DIFFERENCES ===');
    console.log('Same role:', ahad.role === testWorker.role);
    console.log('Same jobPreferences type:', typeof ahad.jobPreferences === typeof testWorker.jobPreferences);
    console.log('Same workHistory type:', typeof ahad.workHistory === typeof testWorker.workHistory);
    console.log('Same availability type:', typeof ahad.availability === typeof testWorker.availability);
    
    // Now let's try to get the detailed profile for TestWorker123 to see what works
    console.log('\n=== TESTING TESTWORKER123 DETAILED PROFILE ===');
    try {
      const testWorkerProfile = await axios.get(`${baseURL}/auth/worker/${testWorker._id}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      console.log('✅ TestWorker123 detailed profile works');
      console.log('Profile keys:', Object.keys(testWorkerProfile.data));
    } catch (error) {
      console.log('❌ TestWorker123 detailed profile failed:', error.response?.data);
    }
    
    // Now let's try Ahad Munshi
    console.log('\n=== TESTING AHAD MUNSHI DETAILED PROFILE ===');
    try {
      const ahadProfile = await axios.get(`${baseURL}/auth/worker/${ahad._id}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      console.log('✅ Ahad Munshi detailed profile works');
      console.log('Profile keys:', Object.keys(ahadProfile.data));
    } catch (error) {
      console.log('❌ Ahad Munshi detailed profile failed:', error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Comparison failed:', error.response?.data || error.message);
  }
}

compareUsers();
