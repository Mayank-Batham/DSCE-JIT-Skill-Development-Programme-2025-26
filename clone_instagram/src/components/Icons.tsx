// SVG icons used across the app
import type { IconProps } from '../types';

export function InstagramLogo() {
  return <span className="instagram-logo-text">Instagram</span>;
}

export function HomeIcon({ filled }: IconProps) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997h0A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997h0A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" /></svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function ExploreIcon({ filled }: IconProps) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.173 13.164h1.341l.508-1.688 1.341-4.455-4.455 1.341-1.688.508v1.341l-3.697 10.875 10.875-3.697z" /><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 10 10" /><path d="m16.24 7.76 2.12-2.12" /><path d="M12 8v4l3 3" /></svg>
  );
}

export function ReelsIcon({ filled }: IconProps) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.823 1l2.974 5.002H16.5c-1.421 0-2.643.97-2.977 2.358L12 14l-1.523-5.64C10.143 6.97 8.921 6 7.5 6H5.197L8.171 1h4.652zM4 22h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-7.171l-2.974 5.002H7.5c-.347 0-.665.118-.922.315L3 14.829V20c0 1.103.897 2 2 2z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M10 8l6 4-6 4V8z" /></svg>
  );
}

export function MessagesIcon({ filled }: IconProps) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 9.84 9.84 0 0 1-2.32-.274l-3.894 1.026a1 1 0 0 1-1.214-1.214l1.026-3.894A9.84 9.84 0 0 1 2.203 12a9.705 9.705 0 0 1 9.8-9.8z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
  );
}

export function NotificationsIcon({ filled }: IconProps) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.001 2.004h-3.172a8.94 8.94 0 0 1 1.821 5.004c0 4.971-4.029 9-9 9s-9-4.029-9-9c0-1.844.556-3.558 1.509-4.984H-.003v2h2.001c0 3.859 3.14 7 7 7s7-3.141 7-7h2v-2z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
  );
}

export function CreateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 8v8M8 12h8" strokeWidth="2" />
    </svg>
  );
}

export function CreateMediaIcon() {
  return (
    <svg viewBox="0 0 80 64" fill="none" stroke="#fff" strokeWidth="2" className="create-media-icon">
      <rect x="4" y="4" width="44" height="44" rx="4" />
      <circle cx="16" cy="18" r="4" />
      <path d="M4 38l10-8 8 6 10-12 12 14" strokeLinejoin="round" />
      <rect x="28" y="14" width="44" height="44" rx="4" fill="#262626" />
      <polygon points="46,28 46,44 58,36" fill="#fff" stroke="none" />
    </svg>
  );
}

export function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="1.5" /><circle cx="6" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" />
    </svg>
  );
}

export function HeartIcon({ filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function SaveIcon({ filled }: IconProps) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 22a.999.999 0 0 1-.687-.273l-7.313-6.91-7.313 6.91a1 1 0 0 1-1.094.217 1 1 0 0 1-.593-.944V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v16a1 1 0 0 1-1 1z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
  );
}

export function VerifiedBadge() {
  return (
    <span className="verified">
      <svg viewBox="0 0 40 40" fill="#0095f6">
        <path d="M19.998 3.094 14.638 7.14 7.86 5.586 5.586 12.36l-6.36 1.554 1.554 6.36-4.046 5.36 4.046 5.36-1.554 6.36 6.36 1.554 2.274 6.774 6.774-2.274 6.36 1.554-1.554-6.36 4.046-5.36-4.046-5.36 1.554-6.36-6.36-1.554-2.274-6.774-6.774 2.274-6.36-1.554 1.554-6.36-4.046-5.36 4.046-5.36-1.554-6.36 6.36-1.554 2.274-6.774 6.774 2.274 6.36-1.554-1.554 6.36 4.046 5.36-4.046 5.36 1.554 6.36-6.36 1.554-2.274 6.774-6.774-2.274-6.36 1.554 1.554-6.36-4.046-5.36 4.046-5.36-1.554-6.36 6.36-1.554 2.274-6.774z" />
        <path fill="#fff" d="m17.2 24.2-5.5-5.5 1.4-1.4 4.1 4.1 8.5-8.5 1.4 1.4z" />
      </svg>
    </span>
  );
}

export function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
    </svg>
  );
}
