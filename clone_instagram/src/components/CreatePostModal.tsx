import { useState, useRef, type ChangeEvent } from 'react';
import { CreateMediaIcon } from './Icons';
import type { ModalProps } from '../types';

export default function CreatePostModal({ onClose }: ModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleShare = () => {
    // TODO: connect to backend API
    onClose();
  };

  return (
    <div className="modal-overlay create-overlay" onClick={onClose}>
      <div className="modal create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-modal-header">Create new post</div>

        {!image ? (
          <div className="create-modal-content">
            <CreateMediaIcon />
            <p>Drag photos and videos here</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select from computer
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={handleFile}
            />
          </div>
        ) : (
          <div className="create-preview">
            <img src={image} alt="Preview" />
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button onClick={handleShare}>Share</button>
          </div>
        )}
      </div>
    </div>
  );
}
