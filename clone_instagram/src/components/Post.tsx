import { useState } from 'react';
import { HeartIcon, CommentIcon, ShareIcon, SaveIcon, VerifiedBadge } from './Icons';
import { useApp } from '../context/AppContext';
import type { Post as PostType } from '../types';

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const { likedPosts, savedPosts, toggleLike, toggleSave, setSelectedPost } = useApp();
  const [comment, setComment] = useState('');
  const isLiked = likedPosts.has(post.id);
  const isSaved = savedPosts.has(post.id);
  const likeCount = post.likes + (isLiked ? 1 : 0);

  return (
    <article className="post-card">
      <header className="post-header">
        <img src={post.user.avatar} alt={post.user.username} />
        <span className="post-header-user">
          {post.user.username}
          {post.user.verified && <VerifiedBadge />}
        </span>
      </header>

      <img
        src={post.image}
        alt=""
        className="post-image"
        onClick={() => setSelectedPost(post)}
      />

      <div className="post-actions">
        <button className={isLiked ? 'liked' : ''} onClick={() => toggleLike(post.id)}>
          <HeartIcon filled={isLiked} />
        </button>
        <button onClick={() => setSelectedPost(post)}>
          <CommentIcon />
        </button>
        <button><ShareIcon /></button>
        <button className="post-actions-right" onClick={() => toggleSave(post.id)}>
          <SaveIcon filled={isSaved} />
        </button>
      </div>

      <div className="post-likes">{likeCount.toLocaleString()} likes</div>

      <div className="post-caption">
        <span className="username">{post.user.username}</span>
        {post.caption}
      </div>

      {post.comments.length > 0 && (
        <div className="post-comments-link" onClick={() => setSelectedPost(post)}>
          View all {post.comments.length} comments
        </div>
      )}

      <div className="post-time">{post.time}</div>

      <div className="post-comment-box">
        <input
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className={comment ? 'active' : ''}>Post</button>
      </div>
    </article>
  );
}
