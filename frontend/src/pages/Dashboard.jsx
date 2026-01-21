import { useState, useEffect } from 'react';
import StatsCard from '../features/dashboard/StatsCard';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { jobAPI } from '../services/api';

/**
 * Dashboard Page - Main landing page with statistics
 */

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await jobAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">
          No data available. Start by fetching jobs from email!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Overview of your job applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Jobs"
          value={stats.total}
          icon="💼"
          color="blue"
        />
        <StatsCard
          title="Applied"
          value={stats.applied}
          icon="✓"
          color="green"
        />
        <StatsCard
          title="Favorites"
          value={stats.favorites}
          icon="⭐"
          color="yellow"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="purple"
        />
      </div>

      {/* Top Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Top Companies
          </h3>
          {stats.topCompanies && stats.topCompanies.length > 0 ? (
            <ul className="space-y-3">
              {stats.topCompanies.map((company, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700">
                    {company.company}
                  </span>
                  <span className="text-sm bg-linkedin-blue text-white px-3 py-1 rounded-full">
                    {company.count} jobs
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a
              href="/jobs"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-linkedin-blue">
                📋 View All Jobs
              </p>
              <p className="text-sm text-gray-600">
                Browse and manage all your job applications
              </p>
            </a>
            <a
              href="/jobs?filter=favorites"
              className="block p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-yellow-700">⭐ View Favorites</p>
              <p className="text-sm text-gray-600">
                See jobs you've marked as favorites
              </p>
            </a>
            <a
              href="/jobs?filter=pending"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-purple-700">⏳ Pending Jobs</p>
              <p className="text-sm text-gray-600">
                Jobs you haven't applied to yet
              </p>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
