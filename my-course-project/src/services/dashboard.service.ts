import { getDashboardStatsURL } from "./api.service";

export interface MonthlyOrderStats {
  month: string;
  totalOrders: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalOrders: number;
  todayRevenue: number;
  todayOrders: number;
  monthlyOrders: MonthlyOrderStats[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Vui lòng đăng nhập để xem thống kê");
    }

    const response = await fetch(getDashboardStatsURL(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể lấy thống kê dashboard");
    }

    const result = await response.json();
    const backendData = result.data;
    
    console.log("Backend dashboard data:", backendData);
    
    // Ensure all numeric fields are properly converted and handle null/undefined
    const dashboardStats: DashboardStats = {
      totalUsers: Number(backendData.totalUsers) || 0,
      totalCourses: Number(backendData.totalCourses) || 0,
      totalOrders: Number(backendData.totalOrders) || 0,
      todayRevenue: Number(backendData.todayRevenue) || 0,
      todayOrders: Number(backendData.todayOrders) || 0,
      monthlyOrders: (backendData.monthlyOrders || []).map((item: any) => ({
        month: item.month || "",
        totalOrders: Number(item.totalOrders) || 0,
      })),
    };
    
    console.log("Processed dashboard stats:", dashboardStats);
    
    return dashboardStats;
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    throw err instanceof Error
      ? err
      : new Error("Không thể lấy thống kê dashboard");
  }
};
