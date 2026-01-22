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
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
        className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent ${className}`}
      />
    </div>
  );
};

export default Input;
