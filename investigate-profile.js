const axios = require('axios');

async function investigateProfile() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Investigating Ahad Munshi profile issue...');
    
    // Login as employer
    console.log('\n1. Logging in as employer...');
    const employerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestEmployer123',
      password: 'password123'
    });
    const employerToken = employerLogin.data.token;
    console.log('✅ Employer login successful');
    
    // Search for all workers to find Ahad Munshi
    console.log('\n2. Searching for all workers...');
    const allWorkers = await axios.get(`${baseURL}/auth/search-workers`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Found', allWorkers.data.length, 'total workers');
    
    // Find Ahad Munshi
    const ahadMunshi = allWorkers.data.find(worker => 
      worker.name && worker.name.toLowerCase().includes('ahad') && worker.name.toLowerCase().includes('munshi')
    );
    
    if (ahadMunshi) {
      console.log('\n3. Found Ahad Munshi in search results:');
      console.log('ID:', ahadMunshi._id);
      console.log('Name:', ahadMunshi.name);
      console.log('Role:', ahadMunshi.role);
      console.log('Job Preferences:', ahadMunshi.jobPreferences);
      console.log('Is NID Verified:', ahadMunshi.isNidVerified);
      console.log('Created At:', ahadMunshi.createdAt);
      console.log('Full Profile Data:', JSON.stringify(ahadMunshi, null, 2));
      
      // Try to get detailed profile
      console.log('\n4. Attempting to get detailed profile...');
      try {
        const detailedProfile = await axios.get(`${baseURL}/auth/worker/${ahadMunshi._id}`, {
          headers: { Authorization: `Bearer ${employerToken}` }
        });
        console.log('✅ Detailed profile retrieved successfully');
        console.log('Profile has job history:', detailedProfile.data.jobHistory ? detailedProfile.data.jobHistory.length : 0, 'jobs');
        console.log('Profile has reviews:', detailedProfile.data.reviews ? detailedProfile.data.reviews.total : 0, 'reviews');
      } catch (error) {
        console.log('❌ Error getting detailed profile:', error.response?.data || error.message);
        console.log('Status Code:', error.response?.status);
      }
    } else {
      console.log('\n❌ Ahad Munshi not found in search results');
      console.log('Available workers:', allWorkers.data.map(w => w.name));
    }
    
    // Let's also check if there are any workers with similar names
    console.log('\n5. Checking for workers with similar names...');
    const similarNames = allWorkers.data.filter(worker => 
      worker.name && (
        worker.name.toLowerCase().includes('ahad') || 
        worker.name.toLowerCase().includes('munshi')
      )
    );
    
    if (similarNames.length > 0) {
      console.log('Found workers with similar names:');
      similarNames.forEach(worker => {
        console.log('-', worker.name, '(ID:', worker._id + ')');
      });
    } else {
      console.log('No workers found with similar names');
    }
    
    // Let's check the first few workers to see their data structure
    console.log('\n6. Checking data structure of first few workers...');
    allWorkers.data.slice(0, 3).forEach((worker, index) => {
      console.log(`\nWorker ${index + 1}:`);
      console.log('- Name:', worker.name);
      console.log('- ID:', worker._id);
      console.log('- Role:', worker.role);
      console.log('- Has jobPreferences:', !!worker.jobPreferences);
      console.log('- Has address:', !!worker.address);
      console.log('- Has contact:', !!worker.contact);
      console.log('- Is NID Verified:', worker.isNidVerified);
    });
    
  } catch (error) {
    console.error('❌ Investigation failed:', error.response?.data || error.message);
  }
}

investigateProfile();
