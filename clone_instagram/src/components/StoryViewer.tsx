import { useEffect } from 'react';
import type { ModalProps, Story } from '../types';

interface StoryViewerProps extends ModalProps {
  story: Story;
}

export default function StoryViewer({ story, onClose }: StoryViewerProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="story-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="story-progress">
          {story.items.map((item, i) => (
            <div key={item.id} className="story-progress-bar">
              <div className={`story-progress-fill ${i === 0 ? 'active' : ''}`} />
            </div>
          ))}
        </div>

        <div className="story-viewer-header">
          <img src={story.user.avatar} alt="" />
          <span>{story.user.username}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{story.items[0].time}</span>
        </div>

        <img src={story.items[0].image} alt="" className="story-viewer-image" />

        <div className="story-nav prev" onClick={onClose} />
        <div className="story-nav next" onClick={onClose} />
      </div>
    </div>
  );
}
