import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import Loading from '../../components/common/Loading';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { jobAPI } from '../../services/api';

/**
 * Job List Component - Shows all jobs with filtering
 *
 * Tailwind Grid:
 * - grid grid-cols-1 = 1 column on mobile
 * - md:grid-cols-2 = 2 columns on medium screens
 * - lg:grid-cols-3 = 3 columns on large screens
 * - gap-6 = spacing between cards
 */

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    isFavorite: false,
    isApplied: false,
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.isFavorite) params.isFavorite = true;
      if (filters.isApplied) params.isApplied = true;
      params.sortBy = sortBy;
      params.order = sortOrder;

      const response = await jobAPI.getAll(params);
      let jobsData = response.data.data;

      // Apply date range filter on frontend (if backend doesn't support it)
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
      setLoading(false);
    }
  };

  // Fetch jobs on component mount and when filters, sort, or date range change
  useEffect(() => {
    fetchJobs();
  }, [filters, sortBy, sortOrder, dateRange]);

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

    // CSV headers
    const headers = ['Title', 'Company', 'Location', 'URL', 'Status', 'Date Added'];

    // CSV rows
    const rows = jobs.map(job => [
      job.title,
      job.company,
      job.location || 'N/A',
      job.jobUrl || 'N/A',
      job.isApplied ? 'Applied' : job.isFavorite ? 'Favorite' : 'Pending',
      new Date(job.createdAt).toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
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

  if (loading) {
    return <Loading text="Loading jobs..." />;
  }

  return (
    <div>
      {/* Filters Section */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
        {/* Search and Filter Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={filters.search}
              onChange={handleSearchChange}
              label="Search"
            />
          </div>

          {/* Filter Buttons */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-t dark:border-gray-700 pt-4">
          {/* Sort Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
            >
              <option value="createdAt-DESC">Newest First</option>
              <option value="createdAt-ASC">Oldest First</option>
              <option value="company-ASC">Company (A-Z)</option>
              <option value="company-DESC">Company (Z-A)</option>
              <option value="title-ASC">Title (A-Z)</option>
              <option value="title-DESC">Title (Z-A)</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
              />
              {(dateRange.start || dateRange.end) && (
                <button
                  onClick={clearDateRange}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded text-sm"
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
        </p>
        <Button
          onClick={exportToCSV}
          variant="outline"
          size="sm"
          disabled={jobs.length === 0}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onUpdate={fetchJobs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
