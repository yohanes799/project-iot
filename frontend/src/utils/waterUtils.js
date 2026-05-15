/**
 * Returns Tailwind CSS classes for status badge
 */
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Jernih":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Keruh":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Sangat Keruh":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

/**
 * Returns color hex for charts
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "Jernih":      return "#22c55e"; // green-500
    case "Keruh":       return "#eab308"; // yellow-500
    case "Sangat Keruh": return "#ef4444"; // red-500
    default:            return "#6b7280"; // gray-500
  }
};

/**
 * Returns turbidity bar color based on value
 */
export const getTurbidityColor = (value) => {
  if (value < 30) return "#22c55e";
  if (value < 70) return "#eab308";
  return "#ef4444";
};

/**
 * Format date to Indonesian locale
 */
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

/**
 * Format date to short time only
 */
export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
