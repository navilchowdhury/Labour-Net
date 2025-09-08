import React, { useState } from 'react';
import WorkerSearchPanel from '../components/WorkerSearchPanel';
import ChatPanel from '../components/ChatPanel';

const WorkerSearch = () => {
  const [showChat, setShowChat] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleMessageWorker = (worker) => {
    setSelectedWorker(worker);
    setShowChat(true);
  };

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <WorkerSearchPanel 
          user={user} 
          onMessageWorker={handleMessageWorker}
        />
      </div>

      {showChat && (
        <ChatPanel
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          user={user}
          initialReceiver={selectedWorker}
        />
      )}
    </div>
  );
};

export default WorkerSearch;
