export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  verified?: boolean;
}

export interface CurrentUser extends User {
  bio: string;
  website: string;
  posts: number;
  followers: number;
  following: number;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
}

export interface Post {
  id: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  time: string;
}

export interface StoryItem {
  id: string;
  image: string;
  time: string;
}

export interface Story {
  id: string;
  user: User;
  seen: boolean;
  items: StoryItem[];
}

export interface ExplorePost {
  id: string;
  image: string;
  likes: number;
}

export interface Reel {
  id: string;
  user: User;
  video: string;
  likes: number;
  caption: string;
}

export interface Message {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'mention';
  user: User;
  post?: Post;
  text: string;
  time: string;
  read: boolean;
}

export interface Suggestion {
  user: User;
  reason: string;
}

export interface IconProps {
  filled?: boolean;
}

export interface ModalProps {
  onClose: () => void;
}
