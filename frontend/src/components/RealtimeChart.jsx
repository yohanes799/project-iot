import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import { formatTime } from "../utils/waterUtils";

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value?.toFixed(2)} {p.dataKey === "turbidity" ? "NTU" : "pH"}
        </p>
      ))}
    </div>
  );
};

// ─── RealtimeChart ────────────────────────────────────────────
const RealtimeChart = ({ data = [] }) => {
  const [mode, setMode] = useState("turbidity"); // "turbidity" | "ph" | "both"

  const chartData = [...data]
    .slice(0, 20)
    .reverse()
    .map((item) => ({
      time:      formatTime(item.created_at),
      turbidity: parseFloat(item.turbidity),
      ph:        item.ph !== null && item.ph !== undefined ? parseFloat(item.ph) : null,
    }));

  const isEmpty = chartData.length === 0;

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex gap-1 mb-4">
        {[
          { key: "turbidity", label: "Turbidity", color: "blue" },
          { key: "ph",        label: "pH",         color: "green" },
          { key: "both",      label: "Keduanya",   color: "purple" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              mode === key
                ? `bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400`
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">Belum ada data</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />

            {/* Turbidity Y-axis (left) */}
            {(mode === "turbidity" || mode === "both") && (
              <YAxis
                yAxisId="turbidity"
                orientation="left"
                tick={{ fontSize: 10, fill: "#3b82f6" }}
                tickLine={false}
                axisLine={false}
                domain={[0, "auto"]}
                label={{ value: "NTU", angle: -90, position: "insideLeft", offset: 15, style: { fontSize: 10, fill: "#3b82f6" } }}
              />
            )}

            {/* pH Y-axis (right) */}
            {(mode === "ph" || mode === "both") && (
              <YAxis
                yAxisId="ph"
                orientation={mode === "both" ? "right" : "left"}
                tick={{ fontSize: 10, fill: "#22c55e" }}
                tickLine={false}
                axisLine={false}
                domain={[0, 14]}
                label={{ value: "pH", angle: -90, position: mode === "both" ? "insideRight" : "insideLeft", offset: 15, style: { fontSize: 10, fill: "#22c55e" } }}
              />
            )}

            <Tooltip content={<CustomTooltip mode={mode} />} />
            {mode === "both" && <Legend wrapperStyle={{ fontSize: 11 }} />}

            {/* Turbidity line */}
            {(mode === "turbidity" || mode === "both") && (
              <>
                <ReferenceLine yAxisId="turbidity" y={30} stroke="#22c55e" strokeDasharray="4 4"
                  label={{ value: "Jernih", position: "right", fontSize: 9, fill: "#22c55e" }} />
                <ReferenceLine yAxisId="turbidity" y={70} stroke="#eab308" strokeDasharray="4 4"
                  label={{ value: "Keruh", position: "right", fontSize: 9, fill: "#eab308" }} />
                <Line
                  yAxisId="turbidity"
                  type="monotone"
                  dataKey="turbidity"
                  name="Turbidity"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  animationDuration={500}
                  connectNulls
                />
              </>
            )}

            {/* pH line */}
            {(mode === "ph" || mode === "both") && (
              <>
                <ReferenceLine yAxisId="ph" y={6.5} stroke="#f97316" strokeDasharray="4 4"
                  label={{ value: "6.5", position: "right", fontSize: 9, fill: "#f97316" }} />
                <ReferenceLine yAxisId="ph" y={8.5} stroke="#a855f7" strokeDasharray="4 4"
                  label={{ value: "8.5", position: "right", fontSize: 9, fill: "#a855f7" }} />
                <Line
                  yAxisId="ph"
                  type="monotone"
                  dataKey="ph"
                  name="pH"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  animationDuration={500}
                  connectNulls
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RealtimeChart;
