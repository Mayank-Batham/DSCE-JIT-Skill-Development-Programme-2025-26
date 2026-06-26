import { explorePosts, users } from '../data/mockData';
import { HeartIcon } from '../components/Icons';
import { useApp } from '../context/AppContext';

export default function Explore() {
  const { setSelectedPost } = useApp();

  return (
    <div className="explore-grid">
      {explorePosts.map((item) => (
        <div
          key={item.id}
          className="explore-item"
          onClick={() => setSelectedPost({
            ...item,
            user: users[0],
            caption: '',
            comments: [],
            time: '',
          })}
        >
          <img src={item.image} alt="" />
          <div className="explore-overlay">
            <span><HeartIcon filled /> {item.likes.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
