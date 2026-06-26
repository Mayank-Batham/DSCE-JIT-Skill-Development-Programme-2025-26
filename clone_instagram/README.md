# Instagram Clone

A frontend-only Instagram web clone built with **React 19 + TypeScript + Vite**. Uses mock data so you can plug in your own backend later.

## Tech stack

- **React 19** — functional components & hooks
- **TypeScript** — typed components, context, and data
- **React Router** — page navigation
- **Vite** — fast dev server & builds

## Features

- **Home feed** — posts with like, comment, save, and share
- **Stories** — horizontal story bar with full-screen viewer
- **Explore** — photo grid with hover stats
- **Reels** — vertical video-style layout
- **Messages** — conversation list and chat view
- **Notifications** — likes, follows, comments
- **Profile** — user info and post grid
- **Search** — user search overlay
- **Create post** — upload image and add caption (UI only)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Project structure

```
src/
  types/index.ts         # TypeScript interfaces
  hooks/                 # Reusable React hooks
  data/mockData.ts       # Mock data — replace with API calls
  context/AppContext.tsx # Shared state (likes, saves, follows, modals)
  components/            # Reusable React components
  pages/                 # One page component per route
```

## Backend integration

Look for `// TODO: connect to backend API` comments in the code. Main integration points:

| Feature    | File                          |
|------------|-------------------------------|
| Posts/Feed | `data/mockData.ts`, `Feed.tsx` |
| Stories    | `Stories.tsx`, `StoryViewer.tsx` |
| Messages   | `Messages.tsx`                |
| Create post| `CreatePostModal.tsx`         |
| Auth/User  | `mockData.ts` → `currentUser` |

Replace mock data imports with `fetch()` calls to your API when ready.

## Build for production

```bash
npm run build
```
