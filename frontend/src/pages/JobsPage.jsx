import JobList from '../features/jobs/JobList';

/**
 * Jobs Page - Shows all jobs with filtering
 */

const JobsPage = () => {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">All Jobs</h2>
        <p className="text-gray-600">
          Browse and manage your job applications
        </p>
      </div>

      {/* Job List Component */}
      <JobList />
    </div>
  );
};

export default JobsPage;
