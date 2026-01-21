/**
 * Reusable Button Component
 *
 * Tailwind Classes Explained:
 * - px-4 py-2 = padding horizontal 1rem, vertical 0.5rem
 * - rounded = border-radius
 * - font-medium = font-weight: 500
 * - transition = smooth color changes
 * - disabled:opacity-50 = 50% opacity when disabled
 */

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  // Base styles (always applied)
  const baseStyles = 'font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles (color schemes)
  const variants = {
    primary: 'bg-linkedin-blue text-white hover:bg-linkedin-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border-2 border-linkedin-blue text-linkedin-blue hover:bg-linkedin-blue hover:text-white',
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
