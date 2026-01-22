/**
 * Reusable Input Component
 */

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  label,
  name,
  required = false,
  wrapperClassName = 'mb-4',
}) => {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
      />
    </div>
  );
};

export default Input;
