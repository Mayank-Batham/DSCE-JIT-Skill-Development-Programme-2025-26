import { Link } from 'react-router-dom';
import { reels } from '../data/mockData';
import { HomeIcon, ExploreIcon, MessagesIcon, SearchIcon, HeartIcon, CommentIcon, ShareIcon, SaveIcon, MoreIcon } from '../components/Icons';
import { currentUser } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function Reels() {
  const { showSearch, setShowSearch } = useApp();
  const activeReel = reels[0];

  return (
    <div className="reels-page">
      <div className="reels-sidebar">
        <Link to="/" className="nav-item"><HomeIcon /></Link>
        <button className="nav-item" onClick={() => setShowSearch(!showSearch)}><SearchIcon /></button>
        <Link to="/explore" className="nav-item"><ExploreIcon /></Link>
        <Link to="/messages" className="nav-item"><MessagesIcon /></Link>
        <Link to="/profile" className="nav-item">
          <img src={currentUser.avatar} alt="" className="nav-avatar" />
        </Link>
      </div>

      <div className="reels-container">
        <div className="reels-main">
          <div className="reel-card">
            <img src={activeReel.video} alt="" />
            <div className="reel-info">
              <div className="reel-user-row">
                <img src={activeReel.user.avatar} alt="" className="reel-user-avatar" />
                <span className="username">{activeReel.user.username}</span>
                <button className="reel-follow-btn">Follow</button>
              </div>
              <div className="reel-caption">{activeReel.caption}</div>
              <div className="reel-tags">#memes #comedy #funny</div>
            </div>

            <div className="reel-actions">
              <button><HeartIcon /><span>{(activeReel.likes / 1000).toFixed(1)}K</span></button>
              <button><CommentIcon /><span>588</span></button>
              <button><ShareIcon /><span>3,387</span></button>
              <button><SaveIcon /><span>Save</span></button>
              <button><MoreIcon /><span>More</span></button>
            </div>
          </div>

          <div className="reel-nav-controls">
            <button>˄</button>
            <button>˅</button>
          </div>
        </div>

        <div className="reel-messages-pill">
          <span className="reel-pill-dot">9+</span>
          <span>Messages</span>
        </div>
      </div>
    </div>
  );
}
