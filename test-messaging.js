const axios = require('axios');

async function testMessaging() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Testing messaging system...');
    
    // Login as employer
    console.log('\n1. Logging in as employer...');
    const employerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestEmployer123',
      password: 'password123'
    });
    const employerToken = employerLogin.data.token;
    console.log('✅ Employer login successful');
    
    // Login as worker
    console.log('\n2. Logging in as worker...');
    const workerLogin = await axios.post(`${baseURL}/auth/login`, {
      name: 'TestWorker123',
      password: 'password123'
    });
    const workerToken = workerLogin.data.token;
    const workerId = workerLogin.data.user.id;
    console.log('✅ Worker login successful');
    
    // Send message from employer to worker
    console.log('\n3. Sending message from employer to worker...');
    const messageResponse = await axios.post(`${baseURL}/messages/send`, {
      receiverId: workerId,
      content: 'Hello! I saw your profile and I am interested in hiring you for a plumbing job. Are you available?'
    }, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Message sent successfully:', messageResponse.data.content);
    
    // Get conversations for employer
    console.log('\n4. Getting employer conversations...');
    const employerConversations = await axios.get(`${baseURL}/messages/conversations`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Employer has', employerConversations.data.length, 'conversations');
    
    // Get conversations for worker
    console.log('\n5. Getting worker conversations...');
    const workerConversations = await axios.get(`${baseURL}/messages/conversations`, {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    console.log('✅ Worker has', workerConversations.data.length, 'conversations');
    
    // Get unread count for worker
    console.log('\n6. Getting unread count for worker...');
    const unreadCount = await axios.get(`${baseURL}/messages/unread-count`, {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    console.log('✅ Worker has', unreadCount.data.count, 'unread messages');
    
    // Get conversation between employer and worker
    console.log('\n7. Getting conversation between employer and worker...');
    const conversation = await axios.get(`${baseURL}/messages/conversation/${workerId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Conversation has', conversation.data.length, 'messages');
    console.log('Messages:', conversation.data.map(m => ({
      sender: m.sender.name,
      content: m.content,
      timestamp: m.createdAt
    })));
    
    console.log('\n🎉 Messaging system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Messaging test failed:', error.response?.data || error.message);
  }
}

testMessaging();
