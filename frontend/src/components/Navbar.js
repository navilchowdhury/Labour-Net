import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import ChatPanel from './ChatPanel';
import axios from 'axios';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (token) {
      if (user?.role === 'worker') {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
      }
      fetchMessageCount();
      const messageInterval = setInterval(fetchMessageCount, 30000);
      return () => clearInterval(messageInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchMessageCount = async () => {
    try {
      const response = await axios.get('/api/messages/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessageCount(response.data.count);
    } catch (err) {
      console.error('Error fetching message count:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">🏗️</div>
            Labour Net
          </Link>

          <div className="navbar-nav">
            {token ? (
              <>
                <Link to="/jobs" className="nav-link">
                  Jobs
                </Link>
                {user?.role === 'worker' && (
                  <>
                    <Link to="/applications" className="nav-link">
                      My Applications
                    </Link>
                    <Link to="/schedule" className="nav-link">
                      📅 Schedule
                    </Link>
                  </>
                )}
                {user?.role === 'employer' && (
                  <Link to="/worker-search" className="nav-link">
                    Find Workers
                  </Link>
                )}
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {token && (
            <div className="navbar-actions">
              {user?.role === 'worker' && (
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="notification-btn"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => setShowChat(true)}
                className="notification-btn"
              >
                💬
                {messageCount > 0 && (
                  <span className="notification-badge">
                    {messageCount > 9 ? '9+' : messageCount}
                  </span>
                )}
              </button>

              <div className="user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-btn"
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span>{user?.name || 'User'}</span>
                  <span>▼</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">
                      👤 Profile
                    </Link>
                    {user?.role === 'employer' && (
                      <Link to="/my-jobs" className="dropdown-item">
                        💼 My Jobs
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showNotifications && (
        <div className="notification-panel">
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            token={token}
          />
        </div>
      )}

      {showChat && (
        <ChatPanel
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          user={user}
        />
      )}
    </>
  );
}