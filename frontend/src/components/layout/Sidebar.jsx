import { NavLink } from 'react-router-dom';

/**
 * Sidebar Navigation Component
 *
 * Tailwind Classes Explained:
 * - h-screen = height: 100vh (full screen height)
 * - bg-gray-50 = light gray background
 * - border-r = right border
 * - space-y-2 = vertical spacing between children
 */

const Sidebar = () => {
  const navItems = [
    { path: '/', label: '📊 Dashboard', icon: '📊' },
    { path: '/jobs', label: '💼 All Jobs', icon: '💼' },
    { path: '/settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 transition-colors">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-linkedin-blue text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Sidebar Footer */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">💡 Quick Tip</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Click "Fetch New Jobs" to sync your latest LinkedIn job alerts!
          </p>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
