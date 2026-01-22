import { useState } from 'react';
import Button from '../common/Button';
import { jobAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

/**
 * Header Component
 */

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFetchJobs = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await jobAPI.fetchFromEmail(10);
      const { emailsFetched, jobsAdded } = response.data.data;

      setMessage(`✅ Success! Fetched ${emailsFetched} emails, added ${jobsAdded} new jobs.`);

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setMessage('❌ Error fetching jobs. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllJobs = async () => {
    if (!window.confirm('Are you sure you want to DELETE ALL jobs? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await jobAPI.deleteAll();
      setMessage('✅ All jobs deleted successfully.');

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error deleting all jobs:', error);
      setMessage('❌ Error deleting jobs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 sticky top-0 z-10 transition-colors duration-200">
      <div className="flex justify-between items-center">
        {/* Left side - Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            LinkedIn Job Organizer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Organize your job applications efficiently
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-2xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {message && (
            <p className="text-sm font-medium">{message}</p>
          )}
          <Button
            onClick={handleFetchJobs}
            disabled={loading}
            size="md"
          >
            {loading ? '🔄 Fetching...' : '📧 Fetch New Jobs'}
          </Button>
          <Button
            onClick={handleDeleteAllJobs}
            disabled={loading}
            variant="danger"
            size="md"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? '🗑️ Deleting...' : '🗑️ Delete All'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
