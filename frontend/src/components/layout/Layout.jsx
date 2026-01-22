import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Main Layout Component
 * Wraps all pages with Header and Sidebar
 *
 * Tailwind Layout:
 * - flex = flexbox layout
 * - flex-col = column direction (stack vertically)
 * - min-h-screen = minimum height 100vh
 */

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <Header />

      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
