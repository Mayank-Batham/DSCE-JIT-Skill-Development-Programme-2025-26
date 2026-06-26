import { stories, currentUser } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function Stories() {
  const { setActiveStory } = useApp();

  return (
    <div className="stories-bar">
      <div className="stories-scroll">
        <div className="story-item">
          <div className="story-ring seen">
            <img src={currentUser.avatar} alt="Your story" />
          </div>
          <span className="story-username">Your story</span>
        </div>

        {stories.map((story) => (
          <div key={story.id} className="story-item" onClick={() => setActiveStory(story)}>
            <div className={`story-ring ${story.seen ? 'seen' : ''}`}>
              <img src={story.user.avatar} alt={story.user.username} />
            </div>
            <span className="story-username">{story.user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
