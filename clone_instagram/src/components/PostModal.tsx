import { HeartIcon, CommentIcon, ShareIcon, SaveIcon, VerifiedBadge } from './Icons';
import { useApp } from '../context/AppContext';
import type { ModalProps, Post } from '../types';

interface PostModalProps extends ModalProps {
  post: Post;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const { likedPosts, savedPosts, toggleLike, toggleSave } = useApp();
  const isLiked = likedPosts.has(post.id);
  const isSaved = savedPosts.has(post.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="post-modal-image">
          <img src={post.image} alt="" />
        </div>
        <div className="post-modal-sidebar">
          <header className="post-header">
            <img src={post.user.avatar} alt="" />
            <span className="post-header-user">
              {post.user.username}
              {post.user.verified && <VerifiedBadge />}
            </span>
          </header>

          <div className="post-modal-comments">
            <div className="post-caption" style={{ marginBottom: 16 }}>
              <span className="username">{post.user.username}</span>
              {post.caption}
            </div>
            {post.comments.map((c) => (
              <div key={c.id} className="comment-item">
                <img src={c.user.avatar} alt="" />
                <div>
                  <span className="username">{c.user.username}</span> {c.text}
                </div>
              </div>
            ))}
          </div>

          <div className="post-actions">
            <button className={isLiked ? 'liked' : ''} onClick={() => toggleLike(post.id)}>
              <HeartIcon filled={isLiked} />
            </button>
            <button><CommentIcon /></button>
            <button><ShareIcon /></button>
            <button className="post-actions-right" onClick={() => toggleSave(post.id)}>
              <SaveIcon filled={isSaved} />
            </button>
          </div>

          <div className="post-likes">{(post.likes + (isLiked ? 1 : 0)).toLocaleString()} likes</div>
          <div className="post-time">{post.time}</div>

          <div className="post-comment-box">
            <input placeholder="Add a comment..." />
            <button>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
