"use client";
import React from "react";
import { BlogPost } from "@/types/blog.types";
import { BookOpen, FileText, Tag, User, Eye } from "lucide-react";
import { useBlogForm } from "@/hooks/useBlogForm";
import { BLOG_CATEGORIES, TIPS } from "@/constants/blog.constants";
import { FormInput } from "@/app/(main)/blog/create/FormInput";
import { FormSelect } from "@/app/(main)/blog/create/FormSelect";
import { ImageUpload } from "@/app/(main)/blog/create/ImageUpload";
import { BlogPreview } from "@/app/(main)/blog/create/BlogPreview";
import { FormActions } from "@/app/(main)/blog/create/FormActions";
import { ErrorMessages } from "@/app/(main)/blog/create/ErrorMessages";

export default function CreateBlogPost() {
  const {
    formData,
    imagePreview,
    errors,
    isSubmitting,
    handleChange,
    handleImageChange,
    handleSubmit,
  } = useBlogForm();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 px-8 py-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Tạo Bài Viết Mới
                </h2>
              </div>
              <p className="text-gray-300 mt-2">
                Chia sẻ kiến thức và khóa học của bạn
              </p>
            </div>

            <div className="px-8 py-8">
              <ErrorMessages errors={errors} />

              <FormInput
                label="Tác giả"
                icon={User}
                required
                value={formData.author}
                onChange={(value: string) => handleChange("author", value)}
                placeholder="VD: Huyền Lê Ngọc"
              />

              <FormInput
                label="Tiêu đề bài viết"
                icon={FileText}
                required
                value={formData.title}
                onChange={(value: string) => handleChange("title", value)}
                placeholder="VD: TRẢI NGHIỆM HỌC THỬ REACT NATIVE"
              />

              <FormSelect
                label="Danh mục"
                icon={Tag}
                required
                value={formData.category}
                onChange={(value: string) => handleChange("category", value)}
                options={BLOG_CATEGORIES}
                placeholder="Chọn danh mục"
              />

              <ImageUpload
                image={formData.image}
                imagePreview={imagePreview}
                onChange={handleImageChange}
              />

              <FormInput
                label="Nội dung bài viết"
                icon={FileText}
                required
                type="textarea"
                rows={10}
                value={formData.content}
                onChange={(value: string) => handleChange("content", value)}
                placeholder="Nhập nội dung bài viết của bạn tại đây..."
              />

              <FormActions
                onDraft={() => handleSubmit("draft")}
                onPublish={() => handleSubmit("published")}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-700 px-8 py-6">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Xem trước</h2>
              </div>
              <p className="text-gray-300 mt-2">
                Bài viết sẽ hiển thị như thế này
              </p>
            </div>

            <div className="p-8">
              <BlogPreview
                formData={{ ...formData, id: 0 } as BlogPost}
                imagePreview={imagePreview}
              />

              <div className="mt-6 bg-gray-100 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span> Mẹo viết bài hiệu quả
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {TIPS.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
