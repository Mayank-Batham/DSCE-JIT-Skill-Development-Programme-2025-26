// Mock data — replace with API calls when you add a backend
import type { Conversation, CurrentUser, ExplorePost, Notification, Post, Reel, Story, Suggestion, User } from '../types';

export const currentUser: CurrentUser = {
  id: 'me',
  username: 'your_username',
  name: 'Your Name',
  avatar: 'https://i.pravatar.cc/150?u=your_username',
  bio: 'Building cool things ✨',
  website: 'example.com',
  posts: 12,
  followers: 1284,
  following: 342,
};

export const users: User[] = [
  { id: '1', username: 'sarah_photo', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah_photo', verified: true },
  { id: '2', username: 'mike_travels', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=mike_travels' },
  { id: '3', username: 'emma_art', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=emma_art', verified: true },
  { id: '4', username: 'alex_fitness', name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex_fitness' },
  { id: '5', username: 'luna_music', name: 'Luna Park', avatar: 'https://i.pravatar.cc/150?u=luna_music' },
  { id: '6', username: 'jake_cooks', name: 'Jake Miller', avatar: 'https://i.pravatar.cc/150?u=jake_cooks' },
  { id: '7', username: 'nina_style', name: 'Nina Patel', avatar: 'https://i.pravatar.cc/150?u=nina_style', verified: true },
  { id: '8', username: 'tom_tech', name: 'Tom Lee', avatar: 'https://i.pravatar.cc/150?u=tom_tech' },
];

export const stories: Story[] = [
  { id: 's1', user: users[0], seen: false, items: [{ id: 'si1', image: 'https://picsum.photos/seed/story1/400/700', time: '2h' }] },
  { id: 's2', user: users[1], seen: false, items: [{ id: 'si2', image: 'https://picsum.photos/seed/story2/400/700', time: '4h' }] },
  { id: 's3', user: users[2], seen: true, items: [{ id: 'si3', image: 'https://picsum.photos/seed/story3/400/700', time: '6h' }] },
  { id: 's4', user: users[3], seen: false, items: [{ id: 'si4', image: 'https://picsum.photos/seed/story4/400/700', time: '8h' }] },
  { id: 's5', user: users[4], seen: true, items: [{ id: 'si5', image: 'https://picsum.photos/seed/story5/400/700', time: '10h' }] },
  { id: 's6', user: users[5], seen: false, items: [{ id: 'si6', image: 'https://picsum.photos/seed/story6/400/700', time: '12h' }] },
  { id: 's7', user: users[6], seen: false, items: [{ id: 'si7', image: 'https://picsum.photos/seed/story7/400/700', time: '1d' }] },
];

export const posts: Post[] = [
  {
    id: 'p1',
    user: users[0],
    image: 'https://picsum.photos/seed/post1/600/600',
    caption: 'Golden hour never disappoints 🌅 #photography #sunset',
    likes: 1243,
    comments: [
      { id: 'c1', user: users[1], text: 'Stunning shot! 🔥' },
      { id: 'c2', user: users[2], text: 'Where is this?' },
    ],
    time: '2 hours ago',
  },
  {
    id: 'p2',
    user: users[1],
    image: 'https://picsum.photos/seed/post2/600/750',
    caption: 'Exploring new places, one city at a time ✈️',
    likes: 892,
    comments: [{ id: 'c3', user: users[3], text: 'Add this to my bucket list!' }],
    time: '5 hours ago',
  },
  {
    id: 'p3',
    user: users[2],
    image: 'https://picsum.photos/seed/post3/600/600',
    caption: 'New piece finished! Acrylic on canvas 🎨',
    likes: 2156,
    comments: [
      { id: 'c4', user: users[0], text: 'This is incredible!' },
      { id: 'c5', user: users[4], text: 'Love the colors' },
    ],
    time: '8 hours ago',
  },
  {
    id: 'p4',
    user: users[3],
    image: 'https://picsum.photos/seed/post4/600/600',
    caption: 'Morning workout done 💪 No excuses',
    likes: 567,
    comments: [],
    time: '12 hours ago',
  },
  {
    id: 'p5',
    user: users[4],
    image: 'https://picsum.photos/seed/post5/600/750',
    caption: 'Studio session vibes 🎵 New track dropping soon',
    likes: 3421,
    comments: [{ id: 'c6', user: users[5], text: 'Can\'t wait!' }],
    time: '1 day ago',
  },
];

export const explorePosts: ExplorePost[] = Array.from({ length: 18 }, (_, i) => ({
  id: `ex${i}`,
  image: `https://picsum.photos/seed/explore${i}/400/400`,
  likes: Math.floor(Math.random() * 5000) + 100,
}));

export const reels: Reel[] = [
  { id: 'r1', user: users[0], video: 'https://picsum.photos/seed/reel1/400/700', likes: 12400, caption: 'Behind the scenes 📸' },
  { id: 'r2', user: users[2], video: 'https://picsum.photos/seed/reel2/400/700', likes: 8900, caption: 'Art process timelapse' },
  { id: 'r3', user: users[4], video: 'https://picsum.photos/seed/reel3/400/700', likes: 45200, caption: 'New single preview 🎶' },
  { id: 'r4', user: users[5], video: 'https://picsum.photos/seed/reel4/400/700', likes: 6700, caption: '60 second pasta recipe' },
];

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    user: users[0],
    lastMessage: 'That photo was amazing!',
    time: '2m',
    unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Hey! Loved your latest post', time: '10:30 AM' },
      { id: 'm2', from: 'me', text: 'Thank you so much! 🙏', time: '10:32 AM' },
      { id: 'm3', from: 'them', text: 'That photo was amazing!', time: '10:35 AM' },
    ],
  },
  {
    id: 'conv2',
    user: users[1],
    lastMessage: 'See you tomorrow!',
    time: '1h',
    unread: 0,
    messages: [
      { id: 'm4', from: 'me', text: 'Are we still meeting up?', time: '9:00 AM' },
      { id: 'm5', from: 'them', text: 'Yes! Same place as last time', time: '9:15 AM' },
      { id: 'm6', from: 'them', text: 'See you tomorrow!', time: '9:16 AM' },
    ],
  },
  {
    id: 'conv3',
    user: users[2],
    lastMessage: 'Sent a reel',
    time: '3h',
    unread: 1,
    messages: [
      { id: 'm7', from: 'them', text: 'Check out this reel I made', time: 'Yesterday' },
      { id: 'm8', from: 'them', text: 'Sent a reel', time: 'Yesterday' },
    ],
  },
  {
    id: 'conv4',
    user: users[3],
    lastMessage: 'Thanks for the follow!',
    time: '1d',
    unread: 0,
    messages: [
      { id: 'm9', from: 'them', text: 'Thanks for the follow!', time: 'Monday' },
    ],
  },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'like', user: users[0], post: posts[0], text: 'liked your photo.', time: '2m', read: false },
  { id: 'n2', type: 'follow', user: users[1], text: 'started following you.', time: '15m', read: false },
  { id: 'n3', type: 'comment', user: users[2], post: posts[0], text: 'commented: "Beautiful!"', time: '1h', read: true },
  { id: 'n4', type: 'like', user: users[3], post: posts[1], text: 'liked your photo.', time: '3h', read: true },
  { id: 'n5', type: 'mention', user: users[4], text: 'mentioned you in a comment.', time: '5h', read: true },
  { id: 'n6', type: 'follow', user: users[5], text: 'started following you.', time: '1d', read: true },
];

export const suggestions: Suggestion[] = users.slice(0, 5).map((user) => ({
  user,
  reason: 'Suggested for you',
}));
