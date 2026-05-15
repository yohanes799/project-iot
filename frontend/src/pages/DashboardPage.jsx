import { useState, useEffect, useCallback } from "react";
import useSocket from "../hooks/useSocket";
import { waterService } from "../services/waterService";
import StatCard from "../components/StatCard";
import TurbidityGauge from "../components/TurbidityGauge";
import RealtimeChart from "../components/RealtimeChart";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import { formatDate } from "../utils/waterUtils";

const DashboardPage = () => {
  const [waterData, setWaterData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const { isConnected, latestData } = useSocket();

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [dataRes, statsRes] = await Promise.all([
        waterService.getAll({ limit: 20 }),
        waterService.getStats(),
      ]);
      setWaterData(dataRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle realtime data from Socket.IO
  useEffect(() => {
    if (latestData) {
      setWaterData((prev) => [latestData, ...prev].slice(0, 50));
      setLastUpdate(new Date());

      // Update stats counts
      setStats((prev) => {
        if (!prev) return prev;
        const newStats = { ...prev };
        newStats.total_readings = (parseInt(prev.total_readings) + 1).toString();
        if (latestData.status === "Jernih") newStats.jernih_count = (parseInt(prev.jernih_count) + 1).toString();
        if (latestData.status === "Keruh") newStats.keruh_count = (parseInt(prev.keruh_count) + 1).toString();
        if (latestData.status === "Sangat Keruh") newStats.sangat_keruh_count = (parseInt(prev.sangat_keruh_count) + 1).toString();
        return newStats;
      });
    }
  }, [latestData]);

  const latestReading = waterData[0] || null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Monitoring kualitas air secara realtime
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Connection status */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            isConnected
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            {isConnected ? "Terhubung" : "Terputus"}
          </div>
          {lastUpdate && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Update: {lastUpdate.toLocaleTimeString("id-ID")}
            </span>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pembacaan"
          value={loading ? "—" : (stats?.total_readings || 0)}
          subtitle="Semua data sensor"
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          title="Jernih"
          value={loading ? "—" : (stats?.jernih_count || 0)}
          subtitle="Turbidity < 30 NTU"
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Keruh"
          value={loading ? "—" : (stats?.keruh_count || 0)}
          subtitle="Turbidity 30–70 NTU"
          color="yellow"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatCard
          title="Sangat Keruh"
          value={loading ? "—" : (stats?.sangat_keruh_count || 0)}
          subtitle="Turbidity ≥ 70 NTU"
          color="red"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Main monitoring section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current reading card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Pembacaan Terkini
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : latestReading ? (
            <div className="flex flex-col items-center gap-4">
              <TurbidityGauge value={parseFloat(latestReading.turbidity)} />
              <div className="text-center">
                <StatusBadge status={latestReading.status} />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {formatDate(latestReading.created_at)}
                </p>
              </div>
              <div className="w-full grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Rata-rata</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {parseFloat(stats?.avg_turbidity || 0).toFixed(1)} NTU
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Maks</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {parseFloat(stats?.max_turbidity || 0).toFixed(1)} NTU
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
              Menunggu data sensor...
            </div>
          )}
        </div>

        {/* Realtime chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Grafik Realtime
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              20 data terakhir
            </span>
          </div>
          <RealtimeChart data={waterData} />
        </div>
      </div>

      {/* Recent data table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Data Terbaru
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {waterData.length} entri
          </span>
        </div>
        <div className="p-4">
          <DataTable data={waterData.slice(0, 10)} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
