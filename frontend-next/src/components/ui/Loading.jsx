import { memo } from 'react';

const sizes = {
  sm: 'w-6 h-6 border-2',
  md: 'w-12 h-12 border-4',
  lg: 'w-16 h-16 border-4',
};

const Loading = memo(({ size = 'md', text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizes[size]} border-gray-200 border-t-linkedin-blue rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-4 text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  );
});
Loading.displayName = 'Loading';

export default Loading;
