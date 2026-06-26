import { notifications } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function Notifications() {
  const { toggleFollow, following } = useApp();

  return (
    <div className="notifications-page">
      <div className="notifications-header">Notifications</div>
      {notifications.map((n) => (
        <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
          <img src={n.user.avatar} alt="" />
          <div className="notification-text">
            <span className="username">{n.user.username}</span> {n.text}
            <div className="notification-time">{n.time}</div>
          </div>
          {n.type === 'follow' && (
            <button
              className="notification-follow-btn"
              onClick={() => toggleFollow(n.user.id)}
            >
              {following.has(n.user.id) ? 'Following' : 'Follow'}
            </button>
          )}
          {n.post && (
            <img src={n.post.image} alt="" className="notification-post-thumb" />
          )}
        </div>
      ))}
    </div>
  );
}
