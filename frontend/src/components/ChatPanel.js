import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/ChatPanel.css';

const ChatPanel = ({ isOpen, onClose, user }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/conversation/${partnerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/messages/send', {
        receiverId: selectedConversation.partner._id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      fetchConversations(); // Update conversation list
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.partner._id);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-panel-overlay">
      <div className="chat-panel">
        <div className="chat-header">
          <h3>Messages</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="chat-content">
          <div className="conversations-list">
            <h4>Conversations</h4>
            {conversations.length === 0 ? (
              <p className="no-conversations">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  className={`conversation-item ${selectedConversation?.conversationId === conv.conversationId ? 'active' : ''}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="conversation-info">
                    <strong>{conv.partner.name}</strong>
                    <span className="role-badge">{conv.partner.role}</span>
                  </div>
                  <p className="last-message">{conv.lastMessage.content}</p>
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="chat-area">
            {selectedConversation ? (
              <>
                <div className="chat-messages">
                  {loading ? (
                    <p>Loading messages...</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`message ${message.sender._id === user.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          <p>{message.content}</p>
                          <small>{new Date(message.createdAt).toLocaleString()}</small>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </>
            ) : (
              <div className="no-conversation-selected">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
