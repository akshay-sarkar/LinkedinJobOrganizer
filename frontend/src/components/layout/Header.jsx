import { useState } from 'react';
import Button from '../common/Button';
import DarkModeToggle from '../common/DarkModeToggle';
import { jobAPI } from '../../services/api';

/**
 * Header Component
 *
 * Tailwind Layout Classes:
 * - flex = display: flex
 * - justify-between = space-between (left and right alignment)
 * - items-center = vertical center alignment
 * - bg-white = white background
 * - shadow-sm = small shadow
 * - px-6 py-4 = padding
 */

const Header = () => {
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

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 sticky top-0 z-10 transition-colors">
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
          {message && (
            <p className="text-sm font-medium dark:text-gray-300">{message}</p>
          )}
          <DarkModeToggle />
          <Button
            onClick={handleFetchJobs}
            disabled={loading}
            size="md"
          >
            {loading ? '🔄 Fetching...' : '📧 Fetch New Jobs'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
