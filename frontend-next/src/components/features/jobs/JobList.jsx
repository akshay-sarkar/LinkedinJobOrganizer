'use client';

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import JobCard from './JobCard';
import Loading from '@/components/ui/Loading';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { jobAPI } from '@/lib/api';

const ITEMS_PER_PAGE = 20;
const ITEMS_PER_ROW = 3;
const SEARCH_DEBOUNCE_MS = 350;

// Row component that renders multiple cards per row for grid effect
const JobRow = memo(({ jobs, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 px-1">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
});
JobRow.displayName = 'JobRow';

// Footer component for loading indicator
const ListFooter = ({ context }) => {
  if (!context?.isLoadingMore) return null;
  return (
    <div className="py-4 text-center">
      <Loading size="sm" text="Loading more jobs..." />
    </div>
  );
};

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    isFavorite: false,
    isApplied: false,
  });
  // Separate local state for the search input to allow immediate typing
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const isInitialMount = useRef(true);
  const searchTimerRef = useRef(null);

  // Use refs to avoid stale closures in callbacks
  const jobsRef = useRef(jobs);
  const hasMoreRef = useRef(hasMore);
  const isLoadingMoreRef = useRef(isLoadingMore);

  // Keep refs in sync
  useEffect(() => {
    jobsRef.current = jobs;
  }, [jobs]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
  }, [isLoadingMore]);

  // Build params object
  const buildParams = useCallback((offset = 0) => {
    const params = {
      limit: ITEMS_PER_PAGE,
      offset,
    };
    if (filters.search) params.search = filters.search;
    if (filters.isFavorite) params.isFavorite = true;
    if (filters.isApplied) params.isApplied = true;
    params.sortBy = sortBy;
    params.order = sortOrder;
    return params;
  }, [filters, sortBy, sortOrder]);

  // Apply date range filter on frontend
  const applyDateFilter = useCallback((jobsData) => {
    if (!dateRange.start && !dateRange.end) return jobsData;

    const startTime = dateRange.start ? new Date(dateRange.start).getTime() : -Infinity;
    const endTime = dateRange.end ? new Date(dateRange.end).getTime() : Infinity;

    return jobsData.filter((job) => {
      const jobTime = new Date(job.createdAt).getTime();
      return jobTime >= startTime && jobTime <= endTime;
    });
  }, [dateRange]);

  // Fetch initial jobs
  const fetchJobs = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true);
      setJobs([]);
      setHasMore(true);
    } else {
      setIsFiltering(true);
      setJobs([]);
      setHasMore(true);
    }

    try {
      const params = buildParams(0);
      const response = await jobAPI.getAll(params);
      let jobsData = response.data.data || [];
      const total = response.data.total || jobsData.length;

      jobsData = applyDateFilter(jobsData);

      setJobs(jobsData);
      setTotalCount(total);
      setHasMore(jobsData.length >= ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setIsFiltering(false);
      }
    }
  }, [buildParams, applyDateFilter]);

  // Load more jobs for infinite scroll - uses refs to avoid stale closure
  const loadMoreJobs = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) return;

    setIsLoadingMore(true);

    try {
      const params = buildParams(jobsRef.current.length);
      const response = await jobAPI.getAll(params);
      let newJobs = response.data.data || [];

      newJobs = applyDateFilter(newJobs);

      if (newJobs.length === 0) {
        setHasMore(false);
      } else {
        setJobs(prev => [...prev, ...newJobs]);
        setHasMore(newJobs.length >= ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error loading more jobs:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [buildParams, applyDateFilter]);

  // Single effect for both initial fetch and filter/sort changes.
  // Two separate effects break under React Strict Mode because refs
  // persist across the simulated remount, causing 3 API calls.
  useEffect(() => {
    if (!isInitialMount.current) {
      fetchJobs(false);
      return;
    }
    isInitialMount.current = false;
    fetchJobs(true);
  }, [filters, sortBy, sortOrder, dateRange, fetchJobs]);

  // Handle job update
  const handleJobUpdate = useCallback(async (jobId) => {
    try {
      const response = await jobAPI.getById(jobId);
      const updatedJob = response.data.data;
      setJobs(prev => prev.map(job =>
        job.id === jobId ? updatedJob : job
      ));
    } catch (error) {
      setJobs(prev => prev.filter(job => job.id !== jobId));
    }
  }, []);

  // Debounced search: update input immediately, debounce the filter state
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const toggleFilter = useCallback((filterName) => {
    setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  }, []);

  const handleSortChange = useCallback((e) => {
    const [field, order] = e.target.value.split('-');
    setSortBy(field);
    setSortOrder(order);
  }, []);

  const handleDateRangeChange = useCallback((field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearDateRange = useCallback(() => {
    setDateRange({ start: '', end: '' });
  }, []);

  // CSV Export function
  const exportToCSV = useCallback(() => {
    if (jobs.length === 0) {
      alert('No jobs to export!');
      return;
    }

    const headers = ['Title', 'Company', 'Location', 'URL', 'Status', 'Date Added'];
    const rows = jobs.map(job => [
      job.title,
      job.company,
      job.location || 'N/A',
      job.jobUrl || 'N/A',
      job.isApplied ? 'Applied' : job.isFavorite ? 'Favorite' : 'Pending',
      new Date(job.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `linkedin-jobs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [jobs]);

  // Memoize grouped job rows for virtualization
  const jobRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < jobs.length; i += ITEMS_PER_ROW) {
      rows.push(jobs.slice(i, i + ITEMS_PER_ROW));
    }
    return rows;
  }, [jobs]);

  // Memoize Virtuoso itemContent renderer
  const renderItem = useCallback((index) => {
    const rowJobs = jobRows[index];
    if (!rowJobs || rowJobs.length === 0) return null;
    return (
      <JobRow
        jobs={rowJobs}
        onUpdate={handleJobUpdate}
      />
    );
  }, [jobRows, handleJobUpdate]);

  // Memoize Virtuoso context to avoid unnecessary footer re-renders
  const virtuosoContext = useMemo(() => ({ isLoadingMore }), [isLoadingMore]);

  // Stable components object for Virtuoso
  const virtuosoComponents = useMemo(() => ({
    Footer: ListFooter,
  }), []);

  if (initialLoading) {
    return <Loading text="Loading jobs..." />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filters Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm space-y-4 dark:bg-gray-800 transition-colors duration-200">
        {/* Search and Filter Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchInput}
              onChange={handleSearchChange}
              wrapperClassName=""
            />
          </div>

          <Button
            variant={filters.isFavorite ? 'primary' : 'outline'}
            onClick={() => toggleFilter('isFavorite')}
            size="md"
          >
            {filters.isFavorite ? '⭐ Favorites' : '☆ Show Favorites'}
          </Button>

          <Button
            variant={filters.isApplied ? 'success' : 'outline'}
            onClick={() => toggleFilter('isApplied')}
            size="md"
          >
            {filters.isApplied ? '✓ Applied Only' : 'Show Applied'}
          </Button>
        </div>

        {/* Sort and Date Range Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Sort By
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="createdAt-DESC">Newest First</option>
              <option value="createdAt-ASC">Oldest First</option>
              <option value="company-ASC">Company (A-Z)</option>
              <option value="company-DESC">Company (Z-A)</option>
              <option value="title-ASC">Title (A-Z)</option>
              <option value="title-DESC">Title (Z-A)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              End Date
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {(dateRange.start || dateRange.end) && (
                <button
                  onClick={clearDateRange}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                  title="Clear date range"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Count and Export */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          Showing <span className="font-bold">{jobs.length}</span> jobs
          {totalCount > jobs.length && (
            <span className="text-sm text-gray-400 dark:text-gray-500"> of {totalCount}</span>
          )}
          {(isFiltering || isLoadingMore) && (
            <span className="ml-2 text-sm text-gray-400 dark:text-gray-500">
              ({isFiltering ? 'updating...' : 'loading more...'})
            </span>
          )}
          {hasMore && !isLoadingMore && jobs.length > 0 && (
            <span className="ml-2 text-sm text-blue-500">(scroll for more)</span>
          )}
        </p>
        <Button
          onClick={exportToCSV}
          variant="outline"
          size="sm"
          disabled={jobs.length === 0 || isFiltering}
        >
          📥 Export to CSV
        </Button>
      </div>

      {/* Job Grid with Virtuoso */}
      <div className="relative flex-1 min-h-0">
        {/* Inline loading overlay for filter updates */}
        {isFiltering && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-10 flex items-center justify-center rounded-lg">
            <Loading size="md" text="Updating results..." />
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No jobs found. Try fetching new jobs from email!
            </p>
          </div>
        ) : (
          <Virtuoso
            style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}
            totalCount={jobRows.length}
            context={virtuosoContext}
            endReached={loadMoreJobs}
            overscan={5}
            components={virtuosoComponents}
            itemContent={renderItem}
          />
        )}

        {/* End of list indicator */}
        {!hasMore && jobs.length > 0 && !isLoadingMore && (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400 border-t mt-4">
            All {jobs.length} jobs loaded
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
