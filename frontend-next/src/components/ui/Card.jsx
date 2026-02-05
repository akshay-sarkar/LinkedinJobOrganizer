const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all dark:bg-gray-800 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
