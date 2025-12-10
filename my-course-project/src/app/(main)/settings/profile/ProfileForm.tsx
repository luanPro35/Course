"use client";

import React, { useState } from "react";
import { useProfileForm } from "@/app/(main)/settings/profile/useProfileForm";
import Loading from "@/components/ui/Loading";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { removeTokens } from "@/utils/token";

export default function ProfileForm() {
  const [confirmText, setConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const {
    user,
    form,
    loading,
    handleSubmit,
    handleInputChange,
    handleAvatarChange,
  } = useProfileForm();

  const handleDelete = async () => {
    if (confirmText !== "XÓA TÀI KHOẢN") {
      setDeleteError('Vui lòng nhập chính xác "XÓA TÀI KHOẢN"');
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await AuthService.deleteAccount();
      removeTokens();
      router.push("/?deleted=true");
    } catch (err: any) {
      setDeleteError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <div className="text-center p-8">Vui lòng đăng nhập để xem trang này.</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Cài đặt</h2>
          <p className="text-gray-500 mt-2">
            Quản lý thông tin cá nhân của bạn.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Thông tin cơ bản</h3>
          <p className="text-gray-500 text-sm mb-4">
            Quản lý tên hiển thị, tên người dùng, bio và avatar của bạn.
          </p>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Họ và tên
              </label>
              <Input
                id="fullName"
                name="fullName"
                value={form.fullName || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                Giới thiệu
              </label>
              <Textarea
                id="about"
                name="about"
                value={form.about || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              >
                Avatar
              </label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-full">
                  <Image
                    src={form.avatar || "/images/avatar.png"}
                    alt="Avatar"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </span>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  onChange={handleAvatarChange}
                  className="ml-4"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Thông tin mạng xã hội</h3>
          <p className="text-gray-500 text-sm mb-4">
            Quản lý liên kết tới các trang mạng xã hội của bạn.
          </p>
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div>
              <label
                htmlFor="personalWebsite"
                className="block text-sm font-medium text-gray-700"
              >
                Trang web cá nhân
              </label>
              <Input
                id="personalWebsite"
                name="personalWebsite"
                value={form.personalWebsite || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="github"
                className="block text-sm font-medium text-gray-700"
              >
                GitHub
              </label>
              <Input
                id="github"
                name="github"
                value={form.github || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium text-gray-700"
              >
                LinkedIn
              </label>
              <Input
                id="linkedin"
                name="linkedin"
                value={form.linkedin || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="facebook"
                className="block text-sm font-medium text-gray-700"
              >
                Facebook
              </label>
              <Input
                id="facebook"
                name="facebook"
                value={form.facebook || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="youtube"
                className="block text-sm font-medium text-gray-700"
              >
                YouTube
              </label>
              <Input
                id="youtube"
                name="youtube"
                value={form.youtube || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-8">
          <div className="p-4">
            <div className="text-sm font-medium text-gray-900">Email</div>
            <div className="text-sm text-gray-500 mt-1">{user?.email}</div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu lại"}
          </Button>
          
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            🗑️ Xóa Tài Khoản
          </button>
        </div>
      </form>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setConfirmText("");
                setDeleteError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Xóa Tài Khoản
              </h2>
              <p className="text-gray-600">Hành động này không thể hoàn tác!</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-sm text-red-700">
                <strong>Lưu ý:</strong> Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn,
                bao gồm:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                <li>Thông tin cá nhân</li>
                <li>Khóa học đã đăng ký</li>
                <li>Lịch sử giao dịch</li>
                <li>Bài viết và bình luận</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập <strong>"XÓA TÀI KHOẢN"</strong> để xác nhận
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="XÓA TÀI KHOẢN"
              />
            </div>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                  setDeleteError("");
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading || confirmText !== "XÓA TÀI KHOẢN"}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {deleteLoading ? "Đang xóa..." : "Xóa Tài Khoản"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
