import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Post, Story, Suggestion, User, CurrentUser } from '../types';

// API base URL for the FastAPI recommendation system
const API_BASE = 'http://localhost:8000';

interface AppContextValue {
  likedPosts: Set<string>;
  savedPosts: Set<string>;
  following: Set<string>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleFollow: (userId: string) => void;
  showSearch: boolean;
  setShowSearch: (value: boolean) => void;
  showCreate: boolean;
  setShowCreate: (value: boolean) => void;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
  
  // Dynamic recommendation integration states
  currentUserId: string;
  setCurrentUserId: (userId: string) => void;
  currentProfile: CurrentUser | null;
  feedPosts: Post[];
  userPosts: Post[];
  suggestedUsers: Suggestion[];
  allUsers: User[];
  loadingFeed: boolean;
  loadingSuggestions: boolean;
  loadingUserPosts: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [showSearch, setShowSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Recommendation engine state variables
  const [currentUserId, setCurrentUserId] = useState<string>('1');
  const [currentProfile, setCurrentProfile] = useState<CurrentUser | null>(null);
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<Suggestion[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(true);
  const [loadingUserPosts, setLoadingUserPosts] = useState<boolean>(true);

  // Load the list of users at startup to populate the selector
  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => {
        if (!res.ok) throw new Error('API server is not online');
        return res.json();
      })
      .then((data) => setAllUsers(data))
      .catch((err) => console.warn('Could not load users list. Backend is likely offline.', err));
  }, []);

  // Fetch feed, profile details, and network suggestions when current user changes
  useEffect(() => {
    const userIdNum = parseInt(currentUserId, 10);
    if (isNaN(userIdNum)) return;

    // Load active user's full details
    fetch(`${API_BASE}/user/${userIdNum}`)
      .then((res) => res.json())
      .then((data) => setCurrentProfile(data))
      .catch((err) => console.error('Error fetching user profile:', err));

    // Load recommended post feed (Stage 2 Ranker pipeline)
    setLoadingFeed(true);
    fetch(`${API_BASE}/recommend/feed/${userIdNum}?top_k=15`)
      .then((res) => res.json())
      .then((data) => {
        setFeedPosts(data.recommendations || []);
        setLoadingFeed(false);
      })
      .catch((err) => {
        console.error('Error fetching post recommendations:', err);
        setLoadingFeed(false);
      });

    // Load posts created by this user
    setLoadingUserPosts(true);
    fetch(`${API_BASE}/user/${userIdNum}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setUserPosts(data || []);
        setLoadingUserPosts(false);
      })
      .catch((err) => {
        console.error('Error fetching user posts:', err);
        setLoadingUserPosts(false);
      });

    // Load follow suggestions (Adamic-Adar / PageRank graph signals)
    setLoadingSuggestions(true);
    fetch(`${API_BASE}/recommend/users/${userIdNum}?top_k=5`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestedUsers(data.suggestions || []);
        setLoadingSuggestions(false);
      })
      .catch((err) => {
        console.error('Error fetching user suggestions:', err);
        setLoadingSuggestions(false);
      });
  }, [currentUserId]);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const toggleFollow = (userId: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      likedPosts, savedPosts, following,
      toggleLike, toggleSave, toggleFollow,
      showSearch, setShowSearch,
      showCreate, setShowCreate,
      selectedPost, setSelectedPost,
      activeStory, setActiveStory,
      
      // Pass recommendation states down
      currentUserId, setCurrentUserId,
      currentProfile, feedPosts, userPosts, suggestedUsers, allUsers,
      loadingFeed, loadingSuggestions, loadingUserPosts
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
