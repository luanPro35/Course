"use client";
import React, { useState, useEffect } from "react";
import { getAllOrders, OrderResponse } from "@/services/order.service";
import Image from "next/image";
import Link from "next/link";

const RecentOrders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const data = await getAllOrders(0, 5);

      const { getCourseById } = await import("@/services/adminCourse.service");

      const ordersWithThumbnails = await Promise.all(
        data.content.map(async (order) => {
          if (
            !order.courseThumbnail ||
            order.courseThumbnail === "/images/PostF8.png" ||
            order.courseThumbnail.trim() === ""
          ) {
            try {
              const course = await getCourseById(order.courseId);
              if (course && course.thumbnailUrl) {
                return { ...order, courseThumbnail: course.thumbnailUrl };
              }
            } catch (e) {
              console.error(
                `Failed to fetch course details for order ${order.id}`,
                e
              );
            }
          }
          return order;
        })
      );

      setOrders(ordersWithThumbnails);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FULFILLED":
        return "text-green-600";
      case "PAID":
        return "text-blue-600";
      case "PENDING":
        return "text-yellow-600";
      case "REFUND":
        return "text-purple-600";
      case "FAILED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "FULFILLED":
        return "Hoàn thành";
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Đang xử lý";
      case "REFUND":
        return "Đã hoàn tiền";
      case "FAILED":
        return "Thất bại";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Đơn hàng gần đây
        </h2>
        <Link
          href="/admin/orders"
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Chưa có đơn hàng nào</p>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                  Sản phẩm
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                  Giá tiền
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: OrderResponse, index: number) => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                    index === orders.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={order.courseThumbnail || "/images/PostF8.png"}
                          alt={order.courseName || "Course Image"}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {order.courseName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.orderRef}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-medium text-gray-900">
                      {order.amount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
