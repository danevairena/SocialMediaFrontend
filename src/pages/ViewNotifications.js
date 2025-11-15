import { useNotifications } from '../context/NotificationContext';
import '../styles/ViewNotifications.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const ViewNotifications = () => {
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (n) => {
    if (!n.fromUser) return; // safety check
    if (n.type === 'follow') {
      navigate(`/profile/${n.fromUser.username}`);
    } else if ((n.type === 'like' || n.type === 'comment') && n.postId) {
      navigate(`/post/${n.postId}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="full-notifications-page">
        <h2>All Notifications</h2>
        {notifications.length === 0 && <p>No notifications to show.</p>}
        {notifications.map((n, idx) => (
          <div
            key={idx}
            className="notification-item"
            style={{ backgroundColor: n.isRead ? 'white' : '#fff9d1', cursor: 'pointer' }}
            onClick={() => handleClick(n)}
          >
            {n.fromUser && (
              <img
                src={n.fromUser?.avatar || '/avatars/default-profile-icon.png'}
  alt={n.fromUser?.username || 'Unknown'}
                className={`notification-avatar ${!n.isRead ? 'avatar-unread' : ''}`}
              />
            )}
            <div>
              <strong>{n.fromUser?.username || 'Unknown'}</strong>{' '}
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
      </div>
    </div>
  );
};

export default ViewNotifications;
