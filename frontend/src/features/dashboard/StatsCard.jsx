import Card from '../../components/common/Card';

/**
 * Stats Card Component - Display a single statistic
 */

const StatsCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400',
    red: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <Card className="text-center">
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colorClasses[color]} mb-4`}
      >
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
    </Card>
  );
};

export default StatsCard;
