import { memo } from 'react';

const baseStyles = 'font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-linkedin-blue text-white hover:bg-linkedin-dark',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border-2 border-linkedin-blue text-linkedin-blue hover:bg-linkedin-blue hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

const Button = memo(({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) => {
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
});
Button.displayName = 'Button';

export default Button;
