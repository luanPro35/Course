"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { removeTokens } from "@/utils/token";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmText !== "XÓA TÀI KHOẢN") {
      setError('Vui lòng nhập chính xác "XÓA TÀI KHOẢN"');
      return;
    }

    setLoading(true);
    setError("");

    try {
      await AuthService.deleteAccount();
      removeTokens();
      router.push("/auth/login?deleted=true");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== "XÓA TÀI KHOẢN"}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? "Đang xóa..." : "Xóa Tài Khoản"}
          </button>
        </div>
      </div>
    </div>
  );
}
