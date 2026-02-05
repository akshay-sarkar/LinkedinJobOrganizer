import JobList from '@/components/features/jobs/JobList';

export default function JobsPage() {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">All Jobs</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Browse and manage your job applications
        </p>
      </div>

      {/* Job List Component - Client Component */}
      <JobList />
    </div>
  );
}
