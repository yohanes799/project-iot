import { getTurbidityColor } from "../utils/waterUtils";

/**
 * Visual gauge showing turbidity level
 */
const TurbidityGauge = ({ value, maxValue = 100 }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const color = getTurbidityColor(value);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circular gauge */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
            style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {value?.toFixed(1) ?? "--"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">NTU</span>
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between w-full text-xs text-gray-400 dark:text-gray-500 px-2">
        <span>0</span>
        <span className="text-green-500">30</span>
        <span className="text-yellow-500">70</span>
        <span className="text-red-500">100+</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default TurbidityGauge;
