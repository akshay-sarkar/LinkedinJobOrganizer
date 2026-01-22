# PRD: Fix Search Input Focus Loss Bug

## Overview
Fix a bug where the search input loses focus when the user types, caused by the entire component being replaced with a loading spinner during filter updates.

## Problem Statement
When users type in the search input field on the Jobs page, each keystroke triggers an API call that sets `loading: true`, which unmounts the entire filter form and replaces it with a `<Loading />` component. When loading completes and the form re-renders, the search input has lost focus, forcing users to click the input again after every keystroke.

## User Stories

### US-1: Search without losing focus
**As a** job seeker  
**I want to** type in the search field without losing focus  
**So that** I can quickly filter jobs by keyword without repeated clicking

**Acceptance Criteria:**
- User can type continuously in the search input without losing cursor focus
- Search results update as the user types (after debounce or on each keystroke)
- The filter/search form section remains visible during result loading

### US-2: Visual feedback during filter updates
**As a** user  
**I want to** see that results are loading when I change filters  
**So that** I know the system is responding to my input

**Acceptance Criteria:**
- A loading indicator appears in/over the job results grid area
- The filter controls (search, sort, date range) remain interactive during loading
- Initial page load can still show a full-page loading state

## Technical Approach

### Solution: Separate Loading States
Introduce two distinct loading states in `JobList.jsx`:

1. **`initialLoading`** - Used only on first mount; shows full-page `<Loading />` component
2. **`isFiltering`** (or `resultsLoading`) - Used during filter/sort/search updates; shows inline loading indicator over results grid only

### Implementation Details

**File:** `frontend/src/features/jobs/JobList.jsx`

1. Add new state variables:
   - `initialLoading` (boolean) - true until first successful fetch
   - `isFiltering` (boolean) - true during subsequent filter-triggered fetches

2. Modify `fetchJobs()`:
   - On initial load: set `initialLoading: true`
   - On filter updates: set `isFiltering: true` (keep form mounted)

3. Update render logic:
   - Only show full `<Loading />` when `initialLoading` is true
   - When `isFiltering` is true, render the form normally but show a loading overlay/spinner on the results grid

## Out of Scope
- Debouncing search input (could be added later for performance)
- Skeleton loaders for job cards
- Caching previous results during filtering

## Success Metrics
- User can type full search query without focus interruption
- No regression in existing filter, sort, or date range functionality