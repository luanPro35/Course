"use client";
import React, { useState, useEffect } from "react";
import {
  getAllOrders,
  refundOrder,
  checkOrderStatus,
  OrderResponse,
} from "@/services/order.service";
import Image from "next/image";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllOrders(currentPage, 25);
      
      const { getCourseById } = await import("@/services/adminCourse.service");
      
      const ordersWithThumbnails = await Promise.all(data.content.map(async (order) => {
        if (!order.courseThumbnail || order.courseThumbnail === "/images/PostF8.png" || order.courseThumbnail.trim() === "") {
            try {
                const course = await getCourseById(order.courseId);
                if (course && course.thumbnailUrl) {
                    return { ...order, courseThumbnail: course.thumbnailUrl };
                }
            } catch (e) {
                console.error(`Failed to fetch course details for order ${order.id}`, e);
            }
        }
        return order;
      }));

      setOrders(ordersWithThumbnails);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching orders:", err);
      
      let errorMessage = "Không thể tải danh sách đơn hàng";
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

  const handleRefund = async () => {
    if (!selectedOrder) return;

    setActionLoading(true);
    try {
      await refundOrder(selectedOrder.id);
      alert("Hoàn tiền thành công!");
      setShowRefundModal(false);
      fetchOrders(); // Refresh list
    } catch (err) {
      let errorMessage = "Không thể hoàn tiền";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }
      alert(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckStatus = async (order: OrderResponse) => {
    setSelectedOrder(order);
    setActionLoading(true);
    setShowStatusModal(true);

    try {
      const status = await checkOrderStatus(order.id);
      setOrderStatus(status);
    } catch (err) {
      let errorMessage = "Không thể kiểm tra trạng thái";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }
      setOrderStatus("Lỗi: " + errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      order.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FULFILLED":
        return "bg-green-100 text-green-800";
      case "PAID":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REFUND":
        return "bg-purple-100 text-purple-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600">
            Xem và quản lý tất cả đơn hàng trong hệ thống
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm theo mã đơn hàng hoặc tên khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">Đang xử lý</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="FULFILLED">Hoàn thành</option>
                <option value="REFUND">Đã hoàn tiền</option>
                <option value="FAILED">Thất bại</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-medium text-gray-900">
                          {order.orderRef}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={order.courseThumbnail || "/images/PostF8.png"}
                              alt={order.courseName || "Course Image"}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-medium text-gray-900 truncate">
                              {order.courseName}
                            </p>
                            <p className="text-sm text-gray-500">
                              User ID: {order.userId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-base font-semibold text-gray-900">
                          {order.amount.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                        <div className="text-sm text-gray-500">
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        <br />
                        <span className="text-xs">
                          {new Date(order.createdAt).toLocaleTimeString("vi-VN")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCheckStatus(order)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs font-medium"
                          >
                            Kiểm tra
                          </button>
                          {order.status === "FULFILLED" && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowRefundModal(true);
                              }}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium"
                            >
                              Hoàn tiền
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Trang {currentPage + 1} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                    }
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Xác nhận hoàn tiền
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hoàn tiền cho đơn hàng{" "}
              <span className="font-semibold">{selectedOrder.orderRef}</span>?
            </p>
            <div className="bg-gray-50 rounded p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Khóa học:</span>
                <span className="font-medium">{selectedOrder.courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-semibold text-red-600">
                  {selectedOrder.amount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleRefund}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Đang xử lý..." : "Xác nhận hoàn tiền"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Trạng thái đơn hàng
            </h3>
            <div className="bg-gray-50 rounded p-4 mb-6">
              <div className="mb-3">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <p className="font-semibold">{selectedOrder.orderRef}</p>
              </div>
              <div>
                <span className="text-gray-600">Trạng thái:</span>
                {actionLoading ? (
                  <p className="text-gray-500 mt-2">Đang kiểm tra...</p>
                ) : (
                  <p className="font-semibold text-lg mt-2">{orderStatus}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
