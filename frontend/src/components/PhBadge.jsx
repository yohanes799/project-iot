import { getPhBadgeClass } from "../utils/waterUtils";

/**
 * Reusable pH status badge
 */
const PhBadge = ({ phStatus, size = "md" }) => {
  if (!phStatus) return <span className="text-gray-400 text-xs">—</span>;

  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  const dotColor = {
    Asam:   "bg-orange-500",
    Normal: "bg-green-500",
    Basa:   "bg-purple-500",
  }[phStatus] || "bg-gray-500";

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClass} ${getPhBadgeClass(phStatus)}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {phStatus}
    </span>
  );
};

export default PhBadge;
