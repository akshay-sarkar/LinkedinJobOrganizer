import DashboardContent from '@/components/features/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Overview of your job applications
        </p>
      </div>

      {/* Dashboard Content - Client Component */}
      <DashboardContent />
    </div>
  );
}
