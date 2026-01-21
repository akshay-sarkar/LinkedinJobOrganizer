/**
 * Loading Spinner Component
 *
 * Tailwind Classes Explained:
 * - animate-spin = rotate animation
 * - border-4 = 4px border width
 * - border-t-linkedin-blue = top border colored
 * - border-gray-200 = other borders light gray
 */

const Loading = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizes[size]} border-gray-200 border-t-linkedin-blue rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};

export default Loading;
