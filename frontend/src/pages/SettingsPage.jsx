import Card from '../components/common/Card';

/**
 * Settings Page - Configuration and info
 */

const SettingsPage = () => {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Configuration and application info
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">
            📖 About This App
          </h3>
          <p className="text-gray-600 mb-4">
            LinkedIn Job Alert Organizer helps you manage job applications by
            automatically fetching LinkedIn job alerts from your Gmail and
            organizing them in an easy-to-use dashboard.
          </p>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Tech Stack:</strong> React, Node.js, Express, SQLite
            </p>
            <p>
              <strong>Features:</strong> Email sync, Job tracking, Filtering
            </p>
          </div>
        </Card>

        {/* How to Use */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">
            📚 How to Use
          </h3>
          <ol className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-linkedin-blue">1.</span>
              <span>
                Set up LinkedIn job alerts to be sent to your Gmail account
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-linkedin-blue">2.</span>
              <span>
                Configure your Gmail credentials in the backend .env file
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-linkedin-blue">3.</span>
              <span>
                Click "Fetch New Jobs" in the header to sync emails
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-linkedin-blue">4.</span>
              <span>
                Browse jobs, mark favorites, track applications
              </span>
            </li>
          </ol>
        </Card>

        {/* Backend Status */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">
            🔧 Backend Configuration
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded dark:bg-gray-700/50">
              <span className="text-gray-700 dark:text-gray-300">Backend URL</span>
              <code className="text-sm bg-gray-200 px-2 py-1 rounded dark:bg-gray-600 dark:text-white">
                http://localhost:5500
              </code>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded dark:bg-gray-700/50">
              <span className="text-gray-700 dark:text-gray-300">Frontend URL</span>
              <code className="text-sm bg-gray-200 px-2 py-1 rounded dark:bg-gray-600 dark:text-white">
                http://localhost:5173
              </code>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Make sure the backend server is running on port 5500 for the app
              to work properly.
            </p>
          </div>
        </Card>

        {/* Tips */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">💡 Tips</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex gap-2">
              <span>⭐</span>
              <span>
                Mark jobs as favorites to easily find them later
              </span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>
                Track which jobs you've applied to
              </span>
            </li>
            <li className="flex gap-2">
              <span>🔍</span>
              <span>
                Use the search bar to find specific jobs
              </span>
            </li>
            <li className="flex gap-2">
              <span>🗑️</span>
              <span>
                Delete jobs you're not interested in to keep the list clean
              </span>
            </li>
            <li className="flex gap-2">
              <span>📧</span>
              <span>
                Fetch new jobs regularly to stay updated with latest postings
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
