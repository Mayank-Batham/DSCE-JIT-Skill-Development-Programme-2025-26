import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, ExploreIcon, ReelsIcon, MessagesIcon } from './Icons';
import { currentUser } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function MobileNav() {
  const location = useLocation();
  const { showSearch, setShowSearch, currentProfile } = useApp();

  const activeAvatar = currentProfile?.avatar || currentUser.avatar;

  return (
    <nav className="mobile-nav">
      <NavLink to="/"><HomeIcon filled={location.pathname === '/'} /></NavLink>
      <button onClick={() => setShowSearch(!showSearch)} aria-label="Search">
        <SearchIcon />
      </button>
      <NavLink to="/explore"><ExploreIcon filled={location.pathname === '/explore'} /></NavLink>
      <NavLink to="/reels"><ReelsIcon filled={location.pathname === '/reels'} /></NavLink>
      <NavLink to="/messages"><MessagesIcon filled={location.pathname === '/messages'} /></NavLink>
      <NavLink to="/profile">
        <img src={activeAvatar} alt="" />
      </NavLink>
    </nav>
  );
}
