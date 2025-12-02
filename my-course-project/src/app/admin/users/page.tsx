"use client";

import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  UserWithEnrollments,
} from "@/services/adminUser.service";
import Image from "next/image";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(currentPage, 25);
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Không thể tải người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userEmail: string) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa người dùng "${userEmail}"?\n\nLưu ý: Tất cả dữ liệu liên quan (đơn hàng, khóa học đã đăng ký) sẽ bị xóa vĩnh viễn!`
      )
    ) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      alert("Xóa người dùng thành công!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể xóa người dùng");
    }
  };

  const toggleExpand = (userId: number) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
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
        <div className="max-w-[1600px] mx-auto">
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản Lý Người Dùng
          </h1>
          <p className="text-gray-600">
            Tổng quan về người dùng và khóa học đã đăng ký
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh Sách Người Dùng ({users.length})
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Chưa có người dùng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người Dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai Trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa Học
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 flex-shrink-0">
                              {user.avatar ? (
                                <Image
                                  src={user.avatar}
                                  alt={user.fullName || "User"}
                                  fill
                                  className="object-cover rounded-full"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600 font-semibold">
                                    {user.fullName?.charAt(0) ||
                                      user.email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.fullName || "Chưa cập nhật"}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {user.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleExpand(user.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {user.enrolledCourses.length} khóa học
                            <span className="ml-1">
                              {expandedUserId === user.id ? "▼" : "▶"}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              handleDeleteUser(user.id, user.email)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa người dùng"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      {expandedUserId === user.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Khóa Học Đã Đăng Ký:
                              </h4>
                              {user.enrolledCourses.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                  Chưa đăng ký khóa học nào
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {user.enrolledCourses.map((course) => (
                                    <div
                                      key={course.courseId}
                                      className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                                    >
                                      <div className="relative w-16 h-16 flex-shrink-0">
                                        <Image
                                          src={
                                            course.courseThumbnail ||
                                            "/images/PostF8.png"
                                          }
                                          alt={course.courseTitle}
                                          fill
                                          className="object-cover rounded"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {course.courseTitle}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(
                                            course.enrolledAt
                                          ).toLocaleDateString("vi-VN")}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang trước
              </button>
              <span className="text-sm text-gray-700">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
