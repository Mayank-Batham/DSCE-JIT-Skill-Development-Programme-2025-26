import { useState } from 'react';
import { conversations, currentUser } from '../data/mockData';
import { MessagesIcon } from '../components/Icons';
import type { Conversation } from '../types';

export default function Messages() {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!message.trim()) return;
    // TODO: connect to backend API
    setMessage('');
  };

  return (
    <div className={`messages-page ${activeConv ? 'has-chat' : ''}`}>
      <div className="conversations-list">
        <div className="conversations-header">{currentUser.username}</div>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conversation-item ${activeConv?.id === conv.id ? 'active' : ''}`}
            onClick={() => setActiveConv(conv)}
          >
            <img src={conv.user.avatar} alt="" />
            <div className="conversation-info">
              <div className="username">{conv.user.username}</div>
              <div className={`conversation-last ${conv.unread ? 'unread' : ''}`}>
                {conv.lastMessage}
              </div>
            </div>
            <span className="conversation-time">{conv.time}</span>
          </div>
        ))}
      </div>

      {activeConv ? (
        <div className="chat-view">
          <div className="chat-header">
            <img src={activeConv.user.avatar} alt="" />
            {activeConv.user.username}
          </div>
          <div className="chat-messages">
            {activeConv.messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-bar">
            <input
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div className="chat-empty">
          <MessagesIcon />
          <h3>Your messages</h3>
          <p>Send a message to start a chat.</p>
        </div>
      )}
    </div>
  );
}
