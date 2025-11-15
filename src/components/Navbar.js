import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useProfileContext } from '../context/ProfileContext';
import { useUnreadChats } from "../hooks/useUnreadChats";
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { notifications, markAllAsRead } = useNotifications();
  const { profile } = useProfileContext();
  const [showModal, setShowModal] = useState(false);

  const unreadChats = useUnreadChats();

  const toggleModal = () => {
    if (showModal) {
      markAllAsRead();
    }
    setShowModal(!showModal);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="feed-header">
      <div className="logo-navbar">
        <img src="/logo-smw-transparent.png" alt="Logo" className="logo-image" />
        <h1 className="logo-text">SOCIAL MEDIA WEBSITE</h1>
      </div>

      <div className="nav-icons">
        <i className="bi bi-search" onClick={() => navigate('/search')}></i>
        <i className="bi bi-house-door-fill" onClick={() => navigate('/feed?page=1')}></i>

        {/* Notifications */}
        <div className="notification-wrapper">
          <i className="bi bi-bell-fill" onClick={toggleModal}></i>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}

          {showModal && (
            <div className="notification-modal">
              <h5>Notifications</h5>
              {notifications.slice(0, 5).map((n, idx) => (
                <div
                  key={idx}
                  className="notification-item"
                  style={{ backgroundColor: n.isRead ? 'white' : '#fff9d1', cursor: 'pointer' }}
                  onClick={() => {
                    setShowModal(false);
                    if (n.type === 'follow') navigate(`/profile/${n.fromUser.username}`);
                    else if ((n.type === 'like' || n.type === 'comment') && n.postId) navigate(`/post/${n.postId}`);
                  }}
                >
                  {n.fromUser && (
                    <img
                      src={n.fromUser?.avatar || '/avatars/default-profile-icon.png'}
                      alt={n.fromUser.username}
                      className={`notification-avatar ${!n.isRead ? 'avatar-unread' : ''}`}
                    />
                  )}
                  <div>
                    <strong>{n.fromUser ? n.fromUser.username : 'Unknown'}</strong>{' '}
                    {n.type === 'like'
                      ? 'liked your post'
                      : n.type === 'comment'
                      ? 'commented on your post'
                      : 'followed you'}
                    <br />
                    <small>{new Date(n.timestamp).toLocaleString()}</small>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && <div>No notifications yet.</div>}

              <div
                className="view-all-btn"
                onClick={() => {
                  setShowModal(false);
                  navigate('/viewnotifications');
                }}
              >
                View all notifications →
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="notification-wrapper">
          <i className="bi bi-chat-heart-fill" onClick={() => navigate('/messages')}></i>
          {unreadChats > 0 && <span className="notification-badge">{unreadChats}</span>}
        </div>

        {/* Profile picture */}
        {profile && (
          <img
            src={
              profile.profilePicture
                ? `http://localhost:3001/uploads/profile_pics/${profile.profilePicture}`
                : '/default-profile-icon.png'
            }
            alt="Profile"
            className="navbar-avatar"
            title={profile.username}
            onClick={() => navigate('/me')}
          />
        )}

        <i className="bi bi-box-arrow-right" onClick={handleLogout} title="Logout"></i>
      </div>
    </header>
  );
}

export default Navbar;
