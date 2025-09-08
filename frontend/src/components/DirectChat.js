import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/DirectChat.css';

const DirectChat = ({ recipientId, recipientName, currentUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (recipientId) {
      fetchMessages();
    }
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/messages/conversation/${recipientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      
      // Mark messages as read
      await axios.put(`http://localhost:5000/api/messages/conversation/${recipientId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/messages/send', {
        receiverId: recipientId,
        content: newMessage.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add the new message to the local state
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="direct-chat">
      <div className="chat-header">
        <div className="chat-title">
          <h3>Chat with {recipientName}</h3>
          <span className="chat-status">Online</span>
        </div>
        <button onClick={onClose} className="close-chat-btn">×</button>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender === currentUser.id || message.sender._id === currentUser.id;
            return (
              <div
                key={message._id || index}
                className={`message ${isCurrentUser ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {formatTime(message.createdAt)}
                    {isCurrentUser && (
                      <span className={`message-status ${message.read ? 'read' : 'delivered'}`}>
                        {message.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${recipientName}...`}
            className="chat-input"
            disabled={sending}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectChat;
