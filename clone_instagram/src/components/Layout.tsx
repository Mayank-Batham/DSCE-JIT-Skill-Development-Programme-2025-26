import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import RightSidebar from './RightSidebar';
import SearchModal from './SearchModal';
import CreatePostModal from './CreatePostModal';
import PostModal from './PostModal';
import StoryViewer from './StoryViewer';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const location = useLocation();
  const isReels = location.pathname === '/reels';
  const isWide = ['/messages', '/notifications', '/profile', '/explore'].includes(location.pathname);
  const showRightSidebar = location.pathname === '/';
  const { showSearch, setShowSearch, showCreate, setShowCreate, selectedPost, setSelectedPost, activeStory, setActiveStory } = useApp();

  // Close search when navigating to a new page
  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname, setShowSearch]);

  if (isReels) {
    return (
      <>
        <Outlet />
        <MobileNav />
        {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
        {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
      </>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <div className={`page-center ${isWide ? 'page-wide' : ''}`}>
          <Outlet />
        </div>
        {showRightSidebar && <RightSidebar />}
      </main>
      <MobileNav />

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
    </div>
  );
}
