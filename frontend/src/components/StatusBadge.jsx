import { getStatusBadgeClass } from "../utils/waterUtils";

/**
 * Reusable status badge component
 */
const StatusBadge = ({ status, size = "md" }) => {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  const dotColor = {
    Jernih: "bg-green-500",
    Keruh: "bg-yellow-500",
    "Sangat Keruh": "bg-red-500",
  }[status] || "bg-gray-500";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClass} ${getStatusBadgeClass(status)}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
