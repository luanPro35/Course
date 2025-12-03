"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getAllOrders, OrderResponse } from "@/services/order.service";
import { getAllCourses } from "@/services/adminCourse.service";
import { AdminCourse } from "@/types/admin.types";
import Image from "next/image";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";

interface CourseStats {
  courseId: number;
  courseName: string;
  courseThumbnail: string;
  totalSales: number;
  totalRevenue: number;
  orderCount: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

type DateRangePreset = "all" | "today" | "7days" | "30days" | "thisMonth" | "lastMonth" | "custom";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

export default function TotalProductsPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [ordersData, coursesData] = await Promise.all([
        getAllOrders(0, 1000),
        getAllCourses(0, 1000),
      ]);

      setOrders(ordersData.content);
      setCourses(coursesData.content);
    } catch (err) {
      console.error("Error fetching data:", err);
      let errorMessage = "Không thể tải dữ liệu thống kê";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const getDateRange = (): { start: Date | null; end: Date | null } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRangePreset) {
      case "all":
        return { start: null, end: null };
      case "today":
        return { start: today, end: now };
      case "7days":
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return { start: sevenDaysAgo, end: now };
      case "30days":
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return { start: thirtyDaysAgo, end: now };
      case "thisMonth":
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: thisMonthStart, end: now };
      case "lastMonth":
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        return { start: lastMonthStart, end: lastMonthEnd };
      case "custom":
        return {
          start: customStartDate ? new Date(customStartDate) : null,
          end: customEndDate ? new Date(customEndDate + "T23:59:59") : null,
        };
      default:
        return { start: null, end: null };
    }
  };


  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRange();
    
    return orders.filter((order) => {
      if (order.status !== "FULFILLED") return false;
      
      if (!start && !end) return true;
      
      const orderDate = new Date(order.createdAt);
      
      if (start && orderDate < start) return false;
      if (end && orderDate > end) return false;
      
      return true;
    });
  }, [orders, dateRangePreset, customStartDate, customEndDate]);


  const courseStats = useMemo(() => {
    const coursesMap = new Map<number, AdminCourse>();
    courses.forEach((course) => {
      coursesMap.set(Number(course.id), course);
    });

    const statsMap = new Map<number, CourseStats>();

    filteredOrders.forEach((order) => {
      if (!statsMap.has(order.courseId)) {
        const course = coursesMap.get(order.courseId);
        const thumbnail = course?.thumbnailUrl || order.courseThumbnail || "/images/PostF8.png";
        
        statsMap.set(order.courseId, {
          courseId: order.courseId,
          courseName: order.courseName,
          courseThumbnail: thumbnail,
          totalSales: 0,
          totalRevenue: 0,
          orderCount: 0,
        });
      }

      const stats = statsMap.get(order.courseId)!;
      stats.totalRevenue += order.amount;
      stats.orderCount += 1;
    });

    return Array.from(statsMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [filteredOrders, courses]);


  const dailyRevenueData = useMemo(() => {
    const revenueMap = new Map<string, { revenue: number; orders: number }>();

    filteredOrders.forEach((order) => {
      try {
        const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
        
        if (!revenueMap.has(date)) {
          revenueMap.set(date, { revenue: 0, orders: 0 });
        }
        
        const data = revenueMap.get(date)!;
        data.revenue += order.amount;
        data.orders += 1;
      } catch (e) {
        console.error("Error parsing date:", order.createdAt, e);
      }
    });

    return Array.from(revenueMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => {
        try {
          const dateA = a.date.split("/").reverse().join("-");
          const dateB = b.date.split("/").reverse().join("-");
          return dateA.localeCompare(dateB);
        } catch (e) {
          return 0;
        }
      });
  }, [filteredOrders]);


  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();


    const summaryData = [
      ["Báo Cáo Thống Kê Sản Phẩm"],
      ["Ngày xuất:", new Date().toLocaleDateString("vi-VN")],
      ["Khoảng thời gian:", dateRangePreset === "all" ? "Tất cả" : `${customStartDate || "..."} - ${customEndDate || "..."}`],
      [],
      ["Tổng Quan"],
      ["Tổng doanh thu:", totalRevenue],
      ["Khóa học đã bán:", totalCoursesSold],
      ["Tổng khóa học:", courses.length],
      ["Khóa học đã xuất bản:", courses.filter(c => c.status === "PUBLISHED").length],
      ["Doanh thu TB/Khóa:", courseStats.length > 0 ? totalRevenue / courseStats.length : 0],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Tổng Quan");


    const courseData = [
      ["ID Khóa Học", "Tên Khóa Học", "Số Lượng Bán", "Tổng Doanh Thu", "Doanh Thu TB"],
      ...courseStats.map((stat) => [
        stat.courseId,
        stat.courseName,
        stat.orderCount,
        stat.totalRevenue,
        stat.totalRevenue / stat.orderCount,
      ]),
    ];
    const courseSheet = XLSX.utils.aoa_to_sheet(courseData);
    XLSX.utils.book_append_sheet(wb, courseSheet, "Thống Kê Khóa Học");


    if (dailyRevenueData.length > 0) {
      const dailyData = [
        ["Ngày", "Doanh Thu", "Số Đơn Hàng"],
        ...dailyRevenueData.map((day) => [day.date, day.revenue, day.orders]),
      ];
      const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
      XLSX.utils.book_append_sheet(wb, dailySheet, "Doanh Thu Theo Ngày");
    }


    const filename = `thong-ke-san-pham-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
  };


  const totalRevenue = courseStats.reduce((sum, stat) => sum + stat.totalRevenue, 0);
  const totalCoursesSold = courseStats.reduce((sum, stat) => sum + stat.orderCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thống Kê Sản Phẩm
            </h1>
            <p className="text-gray-600">
              Tổng quan về doanh thu và khóa học đã bán
            </p>
          </div>
          

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất Excel
          </button>
        </div>


        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lọc Theo Thời Gian</h3>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { value: "all", label: "Tất Cả" },
              { value: "today", label: "Hôm Nay" },
              { value: "7days", label: "7 Ngày Qua" },
              { value: "30days", label: "30 Ngày Qua" },
              { value: "thisMonth", label: "Tháng Này" },
              { value: "lastMonth", label: "Tháng Trước" },
              { value: "custom", label: "Tùy Chỉnh" },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setDateRangePreset(preset.value as DateRangePreset)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateRangePreset === preset.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {dateRangePreset === "custom" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ Ngày
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đến Ngày
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Tổng Doanh Thu</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalRevenue)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Khóa Học Đã Bán</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {totalCoursesSold}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Tổng Khóa Học</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{courses.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {courses.filter(c => c.status === "PUBLISHED").length} đã xuất bản
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Doanh Thu TB/Khóa</p>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {courseStats.length > 0
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalRevenue / courseStats.length)
                : "0 ₫"}
            </p>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xu Hướng Doanh Thu
            </h3>
            {dailyRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Doanh Thu"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>


          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 10 Khóa Học Bán Chạy
            </h3>
            {courseStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseStats.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="courseId" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Bar dataKey="totalRevenue" fill="#10B981" name="Doanh Thu" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>


          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Số Lượng Đơn Hàng Theo Ngày
            </h3>
            {dailyRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#8B5CF6" name="Số Đơn Hàng" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Thống Kê Theo Khóa Học
            </h2>
          </div>

          {courseStats.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Chưa có dữ liệu bán hàng</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa Học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số Lượng Bán
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng Doanh Thu
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh Thu TB
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courseStats.map((stat) => (
                    <tr
                      key={stat.courseId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={stat.courseThumbnail}
                              alt={stat.courseName || "Course thumbnail"}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-medium text-gray-900 truncate">
                              {stat.courseName}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {stat.courseId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-base font-semibold text-gray-900">
                          {stat.orderCount}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          đơn hàng
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-bold text-blue-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(stat.totalRevenue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-base font-medium text-gray-700">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(stat.totalRevenue / stat.orderCount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
