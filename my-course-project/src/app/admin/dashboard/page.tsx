"use client";
import { useState, useEffect } from "react";
import OrderChart from "./OrderChart";
import Information from "./Information";
import DailyIncomeTracker from "./DailyIncomeTracker";
import RecentOrders from "./RecentOrders";
import { getDashboardStats, DashboardStats } from "@/services/dashboard.service";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err instanceof Error ? err.message : "Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Không thể tải dữ liệu"}</p>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Information
            totalOrders={stats.totalOrders}
            totalUsers={stats.totalUsers}
            totalCourses={stats.totalCourses}
          />
          <div className="pt-3">
            <RecentOrders />
          </div>
        </div>
        <div className="lg:col-span-1">
          <DailyIncomeTracker 
            todayRevenue={stats.todayRevenue}
            dailyGoal={10000000}
          />
        </div>
      </div>
      <div className="mt-16">
        <OrderChart data={stats.monthlyOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
