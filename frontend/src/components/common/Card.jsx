/**
 * Reusable Card Component
 *
 * Tailwind Classes Explained:
 * - bg-white = white background
 * - rounded-lg = large border radius
 * - shadow-md = medium box shadow
 * - p-6 = padding: 1.5rem (24px)
 * - hover:shadow-lg = larger shadow on hover
 */

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all dark:text-gray-100 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
