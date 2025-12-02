"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders, OrderResponse } from "@/services/order.service";
import { getAllCourses } from "@/services/adminCourse.service";
import { AdminCourse } from "@/types/admin.types";
import Image from "next/image";

interface CourseStats {
  courseId: number;
  courseName: string;
  courseThumbnail: string;
  totalSales: number;
  totalRevenue: number;
  orderCount: number;
}

export default function TotalProductsPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all orders and courses in parallel
      const [ordersData, coursesData] = await Promise.all([
        getAllOrders(0, 1000), // Get all orders
        getAllCourses(0, 1000), // Get all courses
      ]);

      setOrders(ordersData.content);
      setCourses(coursesData.content);

      // Create a map of courses for quick lookup
      const coursesMap = new Map<number, AdminCourse>();
      coursesData.content.forEach((course) => {
        coursesMap.set(Number(course.id), course);
      });

      // Calculate course statistics
      const statsMap = new Map<number, CourseStats>();

      // Only count FULFILLED orders (completed purchases)
      const fulfilledOrders = ordersData.content.filter(
        (order) => order.status === "FULFILLED"
      );

      fulfilledOrders.forEach((order) => {
        if (!statsMap.has(order.courseId)) {
          // Get actual course data to get correct thumbnail
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

      // Sort by revenue (highest first)
      const sortedStats = Array.from(statsMap.values()).sort(
        (a, b) => b.totalRevenue - a.totalRevenue
      );

      setCourseStats(sortedStats);
    } catch (err) {
      console.error("Error fetching data:", err);

      let errorMessage = "Không thể tải dữ liệu thống kê";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }

      setError(errorMessage);
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

  // Calculate overall statistics
  const totalRevenue = courseStats.reduce(
    (sum, stat) => sum + stat.totalRevenue,
    0
  );
  const totalCoursesSold = courseStats.reduce(
    (sum, stat) => sum + stat.orderCount,
    0
  );
  const totalCourses = courses.length;
  const totalPublishedCourses = courses.filter(
    (c) => c.status === "PUBLISHED"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thống Kê Sản Phẩm
          </h1>
          <p className="text-gray-600">
            Tổng quan về doanh thu và khóa học đã bán
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
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
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
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
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Tổng Khóa Học</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{totalCourses}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalPublishedCourses} đã xuất bản
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Doanh Thu TB/Khóa
              </p>
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

        {/* Course Statistics Table */}
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
