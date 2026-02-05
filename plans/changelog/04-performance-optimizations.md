# Changelog 04: Performance Optimizations

**Date:** February 2026

---

## Summary

A series of performance improvements targeting render efficiency, network request reduction, and large-dataset handling in the Next.js frontend.

---

## Changes

### 1. Search Debouncing (350 ms)

**File:** `frontend-next/src/components/features/jobs/JobList.jsx`

- Added `SEARCH_DEBOUNCE_MS = 350` constant
- `handleSearchChange` updates `searchInput` state immediately (responsive typing) but debounces the `filters.search` state update by 350 ms via `searchTimerRef`
- Prevents excessive API calls while the user is still typing

### 2. React.memo on Leaf Components

Wrapped five components with `React.memo` to skip re-renders when props haven't changed:

| Component | File |
|---|---|
| `JobCard` | `frontend-next/src/components/features/jobs/JobCard.jsx` |
| `JobRow` | `frontend-next/src/components/features/jobs/JobList.jsx` (inline) |
| `Badge` | `frontend-next/src/components/ui/Badge.jsx` |
| `Button` | `frontend-next/src/components/ui/Button.jsx` |
| `Loading` | `frontend-next/src/components/ui/Loading.jsx` |

Each component also sets `displayName` for React DevTools.

### 3. useMemo for Derived Data

**File:** `frontend-next/src/components/features/jobs/JobList.jsx`

- **`jobRows`** — groups the flat `jobs` array into rows of 3 for the Virtuoso grid; recalculates only when `jobs` changes
- **`virtuosoContext`** — wraps `{ isLoadingMore }` so Virtuoso's `Footer` doesn't re-render on unrelated state changes
- **`virtuosoComponents`** — stable `{ Footer: ListFooter }` object reference; recalculates never

### 4. useCallback for All Handlers

**File:** `frontend-next/src/components/features/jobs/JobList.jsx`

Memoized 10+ callback functions so that `React.memo`-wrapped children receive stable references:

- `buildParams`, `applyDateFilter`, `fetchJobs`, `loadMoreJobs`
- `handleJobUpdate`, `handleSearchChange`, `toggleFilter`
- `handleSortChange`, `handleDateRangeChange`, `exportToCSV`
- `renderItem` (Virtuoso item renderer)

**File:** `frontend-next/src/components/features/jobs/JobCard.jsx`

- `handleToggleFavorite`, `handleToggleApplied`, `handleDelete`, `handleViewJob`

### 5. Consolidated Dual useEffect into Single Effect

**File:** `frontend-next/src/components/features/jobs/JobList.jsx`

**Problem:** Two separate `useEffect` hooks (one for initial load, one for filter changes) broke under React Strict Mode — refs persist across the simulated remount, causing three API calls on mount.

**Fix:** Single `useEffect` with an `isInitialMount` ref to distinguish first load from subsequent filter/sort/date changes. Ref-synced values (`jobsRef`, `hasMoreRef`, `isLoadingMoreRef`) prevent stale closures in callbacks.

### 6. Production Console Log Gating

**File:** `frontend-next/src/lib/api.js`

- Request and response interceptors now wrap `console.log` calls in `if (process.env.NODE_ENV === 'development')` checks
- Error logging remains unconditional (useful in production)
- Eliminates console noise in production builds

### 7. Virtualized List Rendering (React Virtuoso)

**File:** `frontend-next/src/components/features/jobs/JobList.jsx`

- Uses `<Virtuoso>` with `endReached` for infinite scroll
- Only renders visible rows (overscan of 5)
- Pagination: loads 20 items per page (`ITEMS_PER_PAGE = 20`)
- Dramatically improves performance with 1000+ job records

---

## How to Verify

```bash
cd frontend-next
npm run build   # Ensure production build succeeds
npm run dev     # Open DevTools → Performance tab → verify no unnecessary re-renders
```
