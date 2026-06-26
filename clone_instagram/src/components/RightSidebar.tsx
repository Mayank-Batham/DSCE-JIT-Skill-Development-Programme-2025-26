import { currentUser, suggestions as mockSuggestions } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function RightSidebar() {
  const { 
    following, 
    toggleFollow, 
    currentUserId, 
    setCurrentUserId, 
    currentProfile, 
    suggestedUsers, 
    allUsers, 
    loadingSuggestions 
  } = useApp();

  // Use recommended user profile, otherwise fall back to mock data
  const activeUser = currentProfile || currentUser;

  // Use graph-based recommendations if online, otherwise fall back to mock recommendations
  const displaySuggestions = suggestedUsers.length > 0 ? suggestedUsers : mockSuggestions;

  return (
    <aside className="right-sidebar">
      {/* Interactive User Switcher Dropdown to demonstrate ML profiles */}
      <div style={{
        marginBottom: '20px', 
        padding: '12px', 
        backgroundColor: '#fafafa', 
        border: '1px solid #dbdbdb', 
        borderRadius: '8px'
      }}>
        <label style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          color: '#8e8e8e', 
          display: 'block', 
          marginBottom: '6px',
          letterSpacing: '0.5px'
        }}>
          ACTIVE ML USER SELECTOR
        </label>
        <select
          value={currentUserId}
          onChange={(e) => setCurrentUserId(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '6px', 
            border: '1px solid #dbdbdb', 
            fontSize: '13px', 
            backgroundColor: '#ffffff',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {allUsers.length > 0 ? (
            allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                User {u.id} (@{u.username})
              </option>
            ))
          ) : (
            // Generate list dynamically if backend connection is lagging
            Array.from({ length: 50 }, (_, i) => (i + 1).toString()).map((id) => (
              <option key={id} value={id}>
                User {id}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="user-card">
        <img src={activeUser.avatar} alt={activeUser.username} />
        <div className="user-card-info">
          <div className="username">{activeUser.username}</div>
          <div className="username-sub">{activeUser.name}</div>
        </div>
        <button className="follow-btn">Switch</button>
      </div>

      <div className="suggestions-header">
        <span>Suggested for you</span>
        <button>See All</button>
      </div>

      {loadingSuggestions ? (
        <div style={{ padding: '10px 0', fontSize: '13px', color: '#8e8e8e' }}>
          Finding mutual connections...
        </div>
      ) : (
        displaySuggestions.map(({ user, reason }) => (
          <div key={user.id} className="suggestion-item">
            <img src={user.avatar} alt={user.username} />
            <div className="suggestion-info">
              <div className="username">{user.username}</div>
              <div className="suggestion-reason">{reason}</div>
            </div>
            <button
              className={`follow-btn ${following.has(user.id) ? 'following' : ''}`}
              onClick={() => toggleFollow(user.id)}
            >
              {following.has(user.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))
      )}

      <div className="footer-links">
        <a href="#">About</a> · <a href="#">Help</a> · <a href="#">Press</a> ·
        <a href="#">API</a> · <a href="#">Jobs</a> · <a href="#">Privacy</a> ·
        <a href="#">Terms</a> · <a href="#">Locations</a> ·
        <a href="#">Language</a> · <a href="#">Meta Verified</a>
      </div>
      <div className="footer-copy">© 2026 INSTAGRAM CLONE</div>
    </aside>
  );
}
