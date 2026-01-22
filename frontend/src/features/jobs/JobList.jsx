import { useState, useEffect, useCallback, useRef } from 'react';
import JobCard from './JobCard';
import Loading from '../../components/common/Loading';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { jobAPI } from '../../services/api';

/**
 * Job List Component - Shows all jobs with filtering
 */

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    isFavorite: false,
    isApplied: false,
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const isInitialMount = useRef(true);

  // Fetch jobs from API
  const fetchJobs = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true);
    } else {
      setIsFiltering(true);
    }
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.isFavorite) params.isFavorite = true;
      if (filters.isApplied) params.isApplied = true;
      params.sortBy = sortBy;
      params.order = sortOrder;

      const response = await jobAPI.getAll(params);
      let jobsData = response.data.data;

      // Apply date range filter on frontend
      if (dateRange.start) {
        jobsData = jobsData.filter(
          (job) => new Date(job.createdAt) >= new Date(dateRange.start)
        );
      }
      if (dateRange.end) {
        jobsData = jobsData.filter(
          (job) => new Date(job.createdAt) <= new Date(dateRange.end)
        );
      }

      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setIsFiltering(false);
      }
    }
  }, [filters, sortBy, sortOrder, dateRange]);

  // Initial fetch on mount
  useEffect(() => {
    fetchJobs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch on filter/sort/search changes (not initial)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchJobs(false);
  }, [fetchJobs]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const toggleFilter = (filterName) => {
    setFilters({ ...filters, [filterName]: !filters[filterName] });
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortBy(field);
    setSortOrder(order);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange({ ...dateRange, [field]: value });
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
  };

  // CSV Export function
  const exportToCSV = () => {
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
  };

  if (initialLoading) {
    return <Loading text="Loading jobs..." />;
  }

  return (
    <div>
      {/* Filters Section */}
      <div className={`mb-6 bg-white p-6 rounded-lg shadow-sm space-y-4 ${isFiltering ? 'opacity-70' : ''}`}>
        {/* Search and Filter Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={filters.search}
              onChange={handleSearchChange}
              label="Search"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
              />
              {(dateRange.start || dateRange.end) && (
                <button
                  onClick={clearDateRange}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
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
        <p className="text-gray-600">
          Showing <span className="font-bold">{jobs.length}</span> jobs
          {isFiltering && <span className="ml-2 text-sm text-gray-400">(updating...)</span>}
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

      {/* Job Grid */}
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            No jobs found. Try fetching new jobs from email!
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isFiltering ? 'opacity-50 pointer-events-none' : ''}`}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onUpdate={() => fetchJobs(false)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
