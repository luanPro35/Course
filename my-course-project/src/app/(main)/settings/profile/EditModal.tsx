import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  success: boolean;
  error: string;
  placeholder?: string;
  isTextarea?: boolean;
  showPreview?: boolean;
  fieldName?: string;
}

export function EditModal({
  isOpen,
  onClose,
  title,
  description,
  label,
  value,
  onChange,
  onSubmit,
  loading,
  success,
  error,
  placeholder = "",
  isTextarea = false,
  showPreview = false,
  fieldName = "",
}: EditModalProps) {
  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-6">{description}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              {isTextarea ? (
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-cyan-400 rounded-full focus:outline-none focus:border-cyan-500 resize-none"
                  style={{ borderRadius: "1.5rem" }}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 border-2 border-cyan-400 rounded-full focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              )}
              {fieldName === "username" && (
                <p className="text-xs text-gray-500 mt-2">
                  Tên khác được hiển thị bên cạnh họ và tên của bạn trên trang
                  cá nhân.
                </p>
              )}
            </div>

            {showPreview && value && (
              <div className="flex justify-center">
                <Image
                  src={value}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit(e);
              }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-full transition-colors disabled:bg-cyan-300 disabled:cursor-not-allowed"
              >
                {loading ? "Đang lưu..." : "Lưu lại"}
              </button>
            </form>

            {success && (
              <div className="text-green-600 text-center text-sm">
                ✓ Cập nhật thành công!
              </div>
            )}
            {error && (
              <div className="text-red-600 text-center text-sm">{error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
