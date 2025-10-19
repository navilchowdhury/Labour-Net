const axios = require('axios');

async function testReviews() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Testing reviews in worker profiles...');
    
    // Login as employer
    const employerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestEmployer123',
      password: 'password123'
    });
    const employerToken = employerLogin.data.token;
    
    // Get Ahad Munshi's profile to check reviews structure
    console.log('\n1. Getting Ahad Munshi profile...');
    const ahadProfile = await axios.get(`${baseURL}/auth/worker/68f116b45ef1cb38ab285b50`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    console.log('✅ Ahad Munshi profile retrieved');
    console.log('Reviews structure:', JSON.stringify(ahadProfile.data.reviews, null, 2));
    console.log('Reviews type:', typeof ahadProfile.data.reviews);
    console.log('Has reviews property:', !!ahadProfile.data.reviews);
    
    if (ahadProfile.data.reviews) {
      console.log('Reviews total:', ahadProfile.data.reviews.total);
      console.log('Reviews averageRating:', ahadProfile.data.reviews.averageRating);
      console.log('Recent reviews length:', ahadProfile.data.reviews.recentReviews?.length || 0);
      
      if (ahadProfile.data.reviews.recentReviews?.length > 0) {
        console.log('First review structure:', JSON.stringify(ahadProfile.data.reviews.recentReviews[0], null, 2));
      }
    }
    
    // Get TestWorker123's profile to compare
    console.log('\n2. Getting TestWorker123 profile...');
    const testWorkerProfile = await axios.get(`${baseURL}/auth/worker/68f1154746fd02819b53bc18`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    console.log('✅ TestWorker123 profile retrieved');
    console.log('Reviews structure:', JSON.stringify(testWorkerProfile.data.reviews, null, 2));
    
    // Test with a worker that might have reviews
    console.log('\n3. Checking all workers for reviews...');
    const searchResponse = await axios.get(`${baseURL}/auth/search-workers`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    
    for (const worker of searchResponse.data.slice(0, 3)) {
      console.log(`\nChecking ${worker.name}...`);
      try {
        const workerProfile = await axios.get(`${baseURL}/auth/worker/${worker._id}`, {
          headers: { Authorization: `Bearer ${employerToken}` }
        });
        
        if (workerProfile.data.reviews && workerProfile.data.reviews.total > 0) {
          console.log(`✅ ${worker.name} has ${workerProfile.data.reviews.total} reviews`);
          console.log('Average rating:', workerProfile.data.reviews.averageRating);
        } else {
          console.log(`ℹ️  ${worker.name} has no reviews`);
        }
      } catch (error) {
        console.log(`❌ Error getting ${worker.name} profile:`, error.response?.data);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testReviews();
