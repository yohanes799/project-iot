// ─── Turbidity Helpers ────────────────────────────────────────

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Jernih":       return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Keruh":        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Sangat Keruh": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:             return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Jernih":       return "#22c55e";
    case "Keruh":        return "#eab308";
    case "Sangat Keruh": return "#ef4444";
    default:             return "#6b7280";
  }
};

export const getTurbidityColor = (value) => {
  if (value < 30) return "#22c55e";
  if (value < 70) return "#eab308";
  return "#ef4444";
};

// ─── pH Helpers ───────────────────────────────────────────────

/**
 * pH status badge Tailwind classes
 * Asam   (< 6.5)  → merah/oranye
 * Normal (6.5–8.5) → hijau
 * Basa   (> 8.5)  → biru/ungu
 */
export const getPhBadgeClass = (phStatus) => {
  switch (phStatus) {
    case "Asam":   return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "Normal": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Basa":   return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    default:       return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const getPhColor = (value) => {
  if (value === null || value === undefined) return "#6b7280";
  if (value < 6.5) return "#f97316"; // orange-500
  if (value <= 8.5) return "#22c55e"; // green-500
  return "#a855f7"; // purple-500
};

export const getPhStatusText = (value) => {
  if (value === null || value === undefined) return "—";
  if (value < 6.5) return "Asam";
  if (value <= 8.5) return "Normal";
  return "Basa";
};

// ─── Date Helpers ─────────────────────────────────────────────

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
