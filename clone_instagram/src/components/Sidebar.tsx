import { NavLink, useLocation } from 'react-router-dom';
import {
  InstagramLogo, HomeIcon, SearchIcon, ExploreIcon, ReelsIcon,
  MessagesIcon, NotificationsIcon, CreateIcon, MoreIcon,
} from './Icons';
import { currentUser } from '../data/mockData';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/explore', icon: ExploreIcon, label: 'Explore' },
  { to: '/reels', icon: ReelsIcon, label: 'Reels' },
  { to: '/messages', icon: MessagesIcon, label: 'Messages', badge: 3 },
  { to: '/notifications', icon: NotificationsIcon, label: 'Notifications', badge: 2 },
];

export default function Sidebar() {
  const location = useLocation();
  const { showSearch, setShowSearch, setShowCreate, currentProfile } = useApp();

  const closeSearch = () => setShowSearch(false);
  const activeAvatar = currentProfile?.avatar || currentUser.avatar;

  return (
    <nav className="sidebar">
      <NavLink to="/" className="sidebar-logo" onClick={closeSearch}>
        <InstagramLogo />
      </NavLink>

      <NavLink
        to="/"
        onClick={closeSearch}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <HomeIcon filled={location.pathname === '/'} />
        <span>Home</span>
      </NavLink>

      <button
        className={`nav-item ${showSearch ? 'active' : ''}`}
        onClick={() => setShowSearch(!showSearch)}
      >
        <SearchIcon />
        <span>Search</span>
      </button>

      {navItems.slice(1).map(({ to, icon: Icon, label, badge }) => (
        <NavLink
          key={to}
          to={to}
          onClick={closeSearch}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon filled={location.pathname === to} />
          <span>{label}</span>
          {badge != null && badge > 0 && <span className="nav-badge">{badge}</span>}
        </NavLink>
      ))}

      <button className="nav-item" onClick={() => { closeSearch(); setShowCreate(true); }}>
        <CreateIcon />
        <span>Create</span>
      </button>

      <NavLink
        to="/profile"
        onClick={closeSearch}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <img src={activeAvatar} alt="" className="nav-avatar" />
        <span>Profile</span>
      </NavLink>

      <div className="sidebar-spacer" />

      <button className="nav-item" onClick={closeSearch}>
        <MoreIcon />
        <span>More</span>
      </button>
    </nav>
  );
}
