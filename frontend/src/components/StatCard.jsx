/**
 * Reusable statistics card component
 */
const StatCard = ({ title, value, subtitle, icon, color = "blue", trend }) => {
  const colorMap = {
    blue:   "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green:  "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    yellow: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    red:    "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${colorMap[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
