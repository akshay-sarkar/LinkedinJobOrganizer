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

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.isFavorite) params.isFavorite = true;
      if (filters.isApplied) params.isApplied = true;

      const response = await jobAPI.getAll(params);
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const toggleFilter = (filterName) => {
    setFilters({ ...filters, [filterName]: !filters[filterName] });
  };

  if (loading) {
    return <Loading text="Loading jobs..." />;
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
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
      </div>

      {/* Job Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-bold">{jobs.length}</span> jobs
        </p>
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
