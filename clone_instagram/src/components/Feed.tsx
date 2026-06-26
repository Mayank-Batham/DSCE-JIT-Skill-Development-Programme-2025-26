import { useApp } from '../context/AppContext';
import { posts as mockPosts } from '../data/mockData';
import Stories from './Stories';
import Post from './Post';

export default function Feed() {
  const { feedPosts, loadingFeed } = useApp();

  // Show a loading text/spinner if the API request is currently in-flight
  if (loadingFeed) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: '#8e8e8e', fontWeight: 500 }}>
        Loading personalized feed...
      </div>
    );
  }

  // Use recommended posts if loaded, otherwise fall back to offline mock posts
  const postsToRender = feedPosts.length > 0 ? feedPosts : mockPosts;

  return (
    <>
      <Stories />
      {postsToRender.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
