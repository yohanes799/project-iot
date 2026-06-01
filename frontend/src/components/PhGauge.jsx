import { getPhColor, getPhStatusText } from "../utils/waterUtils";

/**
 * Visual pH gauge — skala 0–14 dengan zona warna
 */
const PhGauge = ({ value }) => {
  const safeValue = value !== null && value !== undefined ? parseFloat(value) : null;
  const percentage = safeValue !== null ? (safeValue / 14) * 100 : 0;
  const color = getPhColor(safeValue);
  const statusText = getPhStatusText(safeValue);

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
            style={{ transition: "stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease" }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {safeValue !== null ? safeValue.toFixed(1) : "—"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">pH</span>
        </div>
      </div>

      {/* pH scale labels */}
      <div className="flex justify-between w-full text-xs px-2">
        <span className="text-orange-500 font-medium">0 Asam</span>
        <span className="text-green-500 font-medium">7</span>
        <span className="text-purple-500 font-medium">14 Basa</span>
      </div>

      {/* Gradient progress bar */}
      <div className="w-full h-3 rounded-full overflow-hidden"
        style={{ background: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #22c55e, #3b82f6, #a855f7)" }}>
        <div
          className="h-full w-1.5 rounded-full bg-white shadow-md transition-all duration-700"
          style={{ marginLeft: `calc(${percentage}% - 3px)` }}
        />
      </div>

      {/* Zone labels */}
      <div className="flex justify-between w-full text-xs text-gray-400 dark:text-gray-500 px-1">
        <span>Asam &lt;6.5</span>
        <span className="text-green-500">Normal 6.5–8.5</span>
        <span>Basa &gt;8.5</span>
      </div>
    </div>
  );
};

export default PhGauge;
