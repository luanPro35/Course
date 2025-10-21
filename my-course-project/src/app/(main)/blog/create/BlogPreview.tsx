import React from "react";
import Image from "next/image";
interface BlogPreviewProps {
  formData: {
    author: string;
    title: string;
    content: string;
    fullContent: string;
    category: string;
    image: string;
  };
  imagePreview: string;
}

export const BlogPreview = ({ formData, imagePreview }: BlogPreviewProps) => {
  const hasContent =
    formData.title ||
    formData.content ||
    formData.author ||
    formData.fullContent;

  if (!hasContent) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="w-16 h-16 mx-auto mb-4 opacity-50">📝</div>
        <p className="text-lg">Bắt đầu nhập nội dung để xem trước bài viết</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow min-h-64">
      {/* Header với tên tác giả */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-gray-800">
          {formData.author || "Tên tác giả"}
        </span>
      </div>

      {/* Nội dung chính */}
      <div className="flex gap-6">
        {/* Text bên trái */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">
            {formData.title || "TIÊU ĐỀ BÀI VIẾT SẼ HIỂN THỊ Ở ĐÂY"}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {formData.content || "Nội dung bài viết sẽ hiển thị ở đây..."}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {formData.fullContent ||
              "Nội dung đầy đủ của bài viết sẽ hiển thị ở đây..."}
          </p>

          {/* Tags và thông tin */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {formData.category && (
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {formData.category}
              </span>
            )}
          </div>
        </div>

        {/* Hình ảnh bên phải */}
        <div className="flex-shrink-0">
          <div className="relative w-52 h-36 rounded-xl overflow-hidden bg-gray-100">
            {formData.image || imagePreview ? (
              <Image
                src={imagePreview || formData.image || ""}
                alt="Preview"
                width={208}
                height={144}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
