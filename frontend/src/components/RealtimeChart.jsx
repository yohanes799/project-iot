import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatTime } from "../utils/waterUtils";

/**
 * Custom tooltip for the chart
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {payload[0].value?.toFixed(2)} NTU
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Realtime turbidity line chart using Recharts
 */
const RealtimeChart = ({ data = [] }) => {
  // Prepare chart data — show last 20 readings
  const chartData = [...data]
    .slice(0, 20)
    .reverse()
    .map((item) => ({
      time: formatTime(item.created_at),
      turbidity: parseFloat(item.turbidity),
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">Belum ada data</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          domain={[0, "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Reference lines for status thresholds */}
        <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Jernih", position: "right", fontSize: 10, fill: "#22c55e" }} />
        <ReferenceLine y={70} stroke="#eab308" strokeDasharray="4 4" label={{ value: "Keruh", position: "right", fontSize: 10, fill: "#eab308" }} />

        <Line
          type="monotone"
          dataKey="turbidity"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#3b82f6" }}
          animationDuration={500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RealtimeChart;
