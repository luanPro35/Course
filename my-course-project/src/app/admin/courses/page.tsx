"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, 
  LayoutGrid, 
  List, 
  Plus, 
  Edit2, 
  Trash2,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import CourseModal from "./CourseModal";
import { 
  getAllCourses, 
  deleteCourse, 
  updateCourseStatus 
} from "@/services/adminCourse.service";
import { AdminCourse, CourseStatus } from "@/types/admin.types";
import Loading from "@/components/ui/Loading";

interface CourseStats {
  total: number;
  public: number;
  draft: number;
}

type FilterTab = "all" | "published" | "draft";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CourseStats>({ total: 0, public: 0, draft: 0 });
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showToast = (message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAllCourses(0, 100);
      const allCourses = result.content;

      const publicCount = allCourses.filter(c => c.status === "PUBLISHED").length;
      const draftCount = allCourses.filter(c => c.status === "DRAFT").length;

      setStats({
        total: allCourses.length,
        public: publicCount,
        draft: draftCount
      });

      setCourses(allCourses);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast("Không thể tải dữ liệu khóa học", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(id);
      await deleteCourse(Number(id));
      showToast("Đã xóa khóa học thành công", "success");
      fetchData();
      setDeleteConfirm(null);
    } catch (error) {
      showToast("Không thể xóa khóa học", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusToggle = async (course: AdminCourse) => {
    try {
      setActionLoading(course.id);
      const newStatus = course.status === "PUBLISHED" ? CourseStatus.DRAFT : CourseStatus.PUBLISHED;
      await updateCourseStatus(Number(course.id), newStatus);
      showToast(
        newStatus === CourseStatus.PUBLISHED ? "Đã công khai khóa học" : "Đã chuyển về bản nháp",
        "success"
      );
      fetchData();
    } catch (error) {
      showToast("Không thể cập nhật trạng thái", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-slide-in ${
              toast.type === "success" ? "bg-green-500/90 text-white" :
              toast.type === "error" ? "bg-red-500/90 text-white" :
              "bg-blue-500/90 text-white"
            }`}
          >
            {toast.type === "success" && <Check className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Quản lý khóa học
          </h1>
          <p className="text-gray-600 mt-1">Tổng quan và quản lý tất cả khóa học</p>
        </div>
        <Link
          href="/admin/courses/create"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Tạo khóa học mới</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-sm font-semibold text-blue-100">Tổng số</span>
          </div>
          <h3 className="text-4xl font-bold text-white mb-1">{stats.total}</h3>
          <p className="text-blue-100">Khóa học hiện có</p>
        </div>

        <div className="group bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl group-hover:scale-110 transition-transform">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <span className="text-sm font-semibold text-green-100">Công khai</span>
          </div>
          <h3 className="text-4xl font-bold text-white mb-1">{stats.public}</h3>
          <p className="text-green-100">Đang hiển thị</p>
        </div>

        <div className="group bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl group-hover:scale-110 transition-transform">
              <List className="w-7 h-7" />
            </div>
            <span className="text-sm font-semibold text-amber-100">Bản nháp</span>
          </div>
          <h3 className="text-4xl font-bold text-white mb-1">{stats.draft}</h3>
          <p className="text-amber-100">Chưa xuất bản</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Danh sách khóa học</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý và chỉnh sửa khóa học của bạn</p>
        </div>
        
        <div className="border-b border-gray-200 bg-white">
          <div className="flex gap-1 p-4">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter("published")}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                activeFilter === "published"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Công khai ({stats.public})
            </button>
            <button
              onClick={() => setActiveFilter("draft")}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                activeFilter === "draft"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Bản nháp ({stats.draft})
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Khóa học</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100"> 
              {courses
                .filter(course => {
                  if (activeFilter === "all") return true;
                  if (activeFilter === "published") return course.status === "PUBLISHED";
                  if (activeFilter === "draft") return course.status === "DRAFT";
                  return true;
                })
                .map((course) => (
                <tr key={course.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 relative rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        <Image
                          src={course.thumbnailUrl && course.thumbnailUrl.trim() !== "" && !course.thumbnailUrl.startsWith("data:image") && course.thumbnailUrl !== "/default-course.jpg" ? course.thumbnailUrl : "/images/PostF8.png"}
                          alt={course.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">ID: {course.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                      course.price > 0 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }`}>
                      {course.price > 0 ? '⭐ Pro' : '🎓 Miễn phí'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">
                      {course.price > 0 
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)
                        : 'Miễn phí'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                      course.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {course.status === 'PUBLISHED' ? '✓ Công khai' : '○ Bản nháp'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStatusToggle(course)}
                        disabled={actionLoading === course.id}
                        className={`p-2 rounded-lg transition-colors group relative ${
                          course.status === 'PUBLISHED'
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-amber-600 hover:bg-amber-50'
                        }`}
                        title={course.status === 'PUBLISHED' ? "Chuyển về nháp" : "Công khai"}
                      >
                        {actionLoading === course.id ? (
                          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin block"></span>
                        ) : (
                          course.status === 'PUBLISHED' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group relative"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => setDeleteConfirm(course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courses.filter(course => {
          if (activeFilter === "all") return true;
          if (activeFilter === "published") return course.status === "PUBLISHED";
          if (activeFilter === "draft") return course.status === "DRAFT";
          return true;
        }).length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {activeFilter === "all" && "Chưa có khóa học nào"}
              {activeFilter === "published" && "Chưa có khóa học công khai"}
              {activeFilter === "draft" && "Chưa có bản nháp"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {activeFilter === "all" && "Tạo khóa học đầu tiên của bạn"}
              {activeFilter === "published" && "Xuất bản khóa học để hiển thị ở đây"}
              {activeFilter === "draft" && "Tạo bản nháp mới hoặc chuyển khóa học về nháp"}
            </p>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-600 mt-1">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa khóa học này? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading === deleteConfirm}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading === deleteConfirm}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading === deleteConfirm ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Đang xóa...
                  </>
                ) : (
                  'Xóa khóa học'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>

      {isModalOpen && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
            fetchData();
            showToast("Cập nhật khóa học thành công", "success");
          }}
          editCourse={selectedCourse}
        />
      )}
    </div>
  );
}
