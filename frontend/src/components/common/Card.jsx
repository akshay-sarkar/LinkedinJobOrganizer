/**
 * Reusable Card Component
 */

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
