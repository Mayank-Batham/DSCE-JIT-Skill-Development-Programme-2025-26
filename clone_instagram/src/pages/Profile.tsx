import { useState } from 'react';
import { currentUser, posts as mockPosts } from '../data/mockData';
import { GridIcon } from '../components/Icons';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const [tab, setTab] = useState('posts');
  const { setSelectedPost, currentProfile, userPosts, loadingUserPosts } = useApp();

  // Load the active profile details, falling back to mock user if server is offline
  const activeUser = currentProfile || currentUser;

  // Load the user's generated posts, falling back to mock posts
  const postsToRender = userPosts.length > 0 ? userPosts : (loadingUserPosts ? [] : mockPosts);

  return (
    <div>
      <header className="profile-header">
        <div className="profile-avatar">
          <img src={activeUser.avatar} alt={activeUser.username} />
        </div>
        <div className="profile-info">
          <div className="profile-top">
            <h1 className="profile-username">{activeUser.username}</h1>
            <div className="profile-actions">
              <button className="profile-btn">Edit profile</button>
              <button className="profile-btn">View archive</button>
            </div>
          </div>
          <div className="profile-stats">
            <span><strong>{activeUser.posts}</strong> posts</span>
            <span><strong>{activeUser.followers.toLocaleString()}</strong> followers</span>
            <span><strong>{activeUser.following}</strong> following</span>
          </div>
          <div className="profile-bio">
            <div className="name">{activeUser.name}</div>
            <div>{activeUser.bio}</div>
            <a href="#" style={{ color: '#00376b', fontWeight: 600 }}>{activeUser.website}</a>
          </div>
        </div>
      </header>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${tab === 'posts' ? 'active' : ''}`}
          onClick={() => setTab('posts')}
        >
          <GridIcon /> POSTS
        </button>
      </div>

      {loadingUserPosts ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8e8e8e', fontWeight: 500 }}>
          Loading user posts...
        </div>
      ) : (
        <div className="profile-grid">
          {postsToRender.map((post) => (
            <div key={post.id} className="profile-grid-item" onClick={() => setSelectedPost(post)}>
              <img src={post.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
