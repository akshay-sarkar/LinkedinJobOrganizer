# Changelog 03: Vite to Next.js 14 Migration

**Date:** February 2026
**Commit:** `34bf34d` — "Introduced NextJs for Frontend"

---

## Why

- Adopt the Next.js App Router for file-based routing, server components, and built-in API rewrites
- Align with the Firebase Auth integration (providers pattern fits App Router layouts)
- Gain access to Next.js metadata API, image optimization, and future server-side rendering

---

## What Changed

### Deleted
- `frontend/` directory (Vite + React Router setup)
  - `vite.config.js` (dev server with `/api` proxy to port 5500)
  - `src/main.jsx` (ReactDOM.createRoot entry point)
  - `src/pages/` (page components using React Router)
  - `src/context/` (ThemeContext)
  - `src/services/api.js` (Axios client)
  - React Router DOM dependency

### Created
- `frontend-next/` directory (Next.js 14 App Router)
  - `next.config.js` — API rewrites (`/api/:path*` -> `http://localhost:5500/api/:path*`)
  - `src/app/layout.jsx` — root layout with metadata export, providers, sidebar, header
  - `src/app/page.jsx` — dashboard (home)
  - `src/app/jobs/page.jsx` — jobs listing
  - `src/app/settings/page.jsx` — settings
  - `src/providers/AuthProvider.jsx` — Firebase auth context
  - `src/providers/ThemeProvider.jsx` — dark mode context
  - `src/lib/api.js` — Axios client (ported)
  - `src/lib/firebase.js` — Firebase config
  - `jest.config.js` / `jest.setup.js` — testing setup (Jest 30 + React Testing Library)
  - React Virtuoso added for virtualized list rendering

### Key Architectural Differences

| Aspect | Old (Vite) | New (Next.js 14) |
|---|---|---|
| Routing | React Router DOM | File-based App Router (`/app`) |
| Entry point | `main.jsx` + `index.html` | `app/layout.jsx` with metadata |
| API proxy | `vite.config.js` proxy | `next.config.js` rewrites |
| Dev port | 5173 | 3000 |
| Build | `vite build` | `next build` |
| Client marker | N/A (all client) | `'use client'` directive |

### Files Affected
- All 20+ frontend components migrated to `frontend-next/src/`
- `backend/ARCHITECTURE.md` updated to reference "Next.js Frontend"
- Root `.gitignore` updated for `.next/` build directory
- Root documentation files updated with new paths

---

## How to Verify

```bash
cd frontend-next
npm install
npm run dev
# Visit http://localhost:3000
```
