/**
 * Badge Component - For tags and status indicators
 *
 * Tailwind Classes Explained:
 * - inline-block = display as inline-block
 * - text-xs = extra small text
 * - px-2 py-1 = small padding
 * - rounded-full = fully rounded (pill shape)
 */

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
