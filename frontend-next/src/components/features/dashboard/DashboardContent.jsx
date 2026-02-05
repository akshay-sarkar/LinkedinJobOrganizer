'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatsCard from './StatsCard';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import { jobAPI } from '@/lib/api';

const DashboardContent = () => {
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
          <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">
            Top Companies
          </h3>
          {stats.topCompanies && stats.topCompanies.length > 0 ? (
            <ul className="space-y-3">
              {stats.topCompanies.map((company, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">
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
          <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/jobs"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
            >
              <p className="font-medium text-linkedin-blue dark:text-blue-400">
                📋 View All Jobs
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse and manage all your job applications
              </p>
            </Link>
            <Link
              href="/jobs?filter=favorites"
              className="block p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30"
            >
              <p className="font-medium text-yellow-700 dark:text-yellow-400">⭐ View Favorites</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See jobs you've marked as favorites
              </p>
            </Link>
            <Link
              href="/jobs?filter=pending"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors dark:bg-purple-900/20 dark:hover:bg-purple-900/30"
            >
              <p className="font-medium text-purple-700 dark:text-purple-400">⏳ Pending Jobs</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jobs you haven't applied to yet
              </p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
