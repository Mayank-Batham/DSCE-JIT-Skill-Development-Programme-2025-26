import { useState } from 'react';
import { users } from '../data/mockData';
import { SearchIcon } from './Icons';
import { useEscapeKey } from '../hooks/useEscapeKey';
import type { ModalProps } from '../types';

export default function SearchModal({ onClose }: ModalProps) {
  const [query, setQuery] = useState('');
  const results = query
    ? users.filter((u) =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.name.toLowerCase().includes(query.toLowerCase())
      )
    : users;

  useEscapeKey(onClose);

  return (
    <>
      <div className="search-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="search-panel" role="dialog" aria-label="Search">
        <div className="search-panel-header">
          <h2>Search</h2>
          <button className="search-close" onClick={onClose} aria-label="Close search">✕</button>
        </div>

        <div className="search-input-wrap">
          <SearchIcon />
          <input
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <div className="search-results">
          {!query && <p className="search-recent-label">Recent</p>}
          {results.map((user) => (
            <div key={user.id} className="search-result-item" onClick={onClose}>
              <img src={user.avatar} alt={user.username} />
              <div>
                <div className="username">{user.username}</div>
                <div className="username-sub">{user.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
