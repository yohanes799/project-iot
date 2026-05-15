import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/waterUtils";

/**
 * Data table for water quality history
 */
const DataTable = ({ data = [], onDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm">Belum ada data tersedia</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              #
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              Turbidity (NTU)
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              Waktu
            </th>
            {onDelete && (
              <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((row, index) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-400 dark:text-gray-500 text-xs">
                {index + 1}
              </td>
              <td className="py-3 px-4">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {parseFloat(row.turbidity).toFixed(2)}
                </span>
                <span className="text-gray-400 dark:text-gray-500 ml-1 text-xs">NTU</span>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={row.status} size="sm" />
              </td>
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
                {formatDate(row.created_at)}
              </td>
              {onDelete && (
                <td className="py-3 px-4">
                  <button
                    onClick={() => onDelete(row.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Hapus data"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
