"use client";
import { useBlogForm } from "@/hooks/useBlogForm";
import { BLOG_CATEGORIES, TIPS } from "@/constants/blog.constants";
import { BookOpen, Eye, FileText, Loader2, Tag, User } from "lucide-react";
import { BlogPreview } from "./BlogPreview"; // Assuming this component is updated or doesn't need imagePreview

// Simple FormInput component for clarity
import React, { ComponentType, ReactNode } from "react";

interface BaseProps {
  label: string;
  icon: ComponentType<{ className: string }>;
  required?: boolean;
}

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & BaseProps;

const FormInput = ({
  label,
  icon: Icon,
  required,
  ...rest
}: FormInputProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="w-5 h-5 text-gray-400" />
        </span>
        <input
          {...rest}
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

type FormTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  BaseProps;

const FormTextarea = ({
  label,
  icon: Icon,
  required,
  ...rest
}: FormTextareaProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute top-3 left-0 flex items-center pl-3">
          <Icon className="w-5 h-5 text-gray-400" />
        </span>
        <textarea
          {...rest}
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> &
  BaseProps & {
    options: { value: string; label: string }[];
    placeholder: string;
  };

const FormSelect = ({
  label,
  icon: Icon,
  required,
  options,
  placeholder,
  ...rest
}: FormSelectProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="w-5 h-5 text-gray-400" />
        </span>
        <select
          {...rest}
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default function CreateBlogPost() {
  const {
    formData,
    errors,
    isSubmitting,
    isUploading, // Use the new state
    imagePreview,
    handleChange,
    handleImageChange, // Use the new handler
    handleSubmit,
  } = useBlogForm({
    id: 0,
    author: "",
    title: "",
    content: "",
    category: "",
    image: "",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="bg-gray-800 px-8 py-6 rounded-t-xl">
              <div className="flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-orange-400" />
                <h2 className="text-3xl font-bold text-white">
                  Tạo Bài Viết Mới
                </h2>
              </div>
              <p className="text-gray-300 mt-2">
                Chia sẻ kiến thức và kinh nghiệm của bạn đến với mọi người.
              </p>
            </div>

            <div className="p-8">
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <h3 className="text-sm font-bold text-red-800">
                    Vui lòng sửa các lỗi sau:
                  </h3>
                  <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                    {Object.values(errors).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <FormInput
                label="Tác giả"
                name="author"
                icon={User}
                required
                value={formData.author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e, "author")
                }
                placeholder="VD: Huyền Lê Ngọc"
              />

              <FormInput
                label="Tiêu đề bài viết"
                name="title"
                icon={FileText}
                required
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e, "title")
                }
                placeholder="VD: Kinh nghiệm học React Native cho người mới"
              />

              <FormSelect
                label="Danh mục"
                name="category"
                icon={Tag}
                required
                value={formData.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleChange(e, "category")
                }
                options={BLOG_CATEGORIES}
                placeholder="Chọn danh mục"
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  />
                  {isUploading && (
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  )}
                </div>
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              <FormTextarea
                label="Nội dung bài viết"
                name="content"
                icon={FileText}
                required
                rows={10}
                value={formData.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(e, "content")
                }
                placeholder="Nhập nội dung bài viết của bạn tại đây..."
              />

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => handleSubmit("draft")}
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Lưu nháp
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit("published")}
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Đang xuất bản..." : "Xuất bản"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="bg-gray-700 px-8 py-6 rounded-t-xl">
              <div className="flex items-center gap-4">
                <Eye className="w-8 h-8 text-orange-400" />
                <h2 className="text-3xl font-bold text-white">Xem trước</h2>
              </div>
              <p className="text-gray-300 mt-2">
                Bài viết của bạn sẽ hiển thị như thế này.
              </p>
            </div>

            <div className="p-8">
              <BlogPreview
                formData={formData}
                imagePreview={imagePreview || ""}
              />

              <div className="mt-8 bg-orange-50 rounded-lg p-6">
                <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2 text-lg">
                  <span className="text-2xl">💡</span> Mẹo viết bài
                </h3>
                <ul className="space-y-2 text-orange-700 text-sm">
                  {TIPS.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{tip}</span>
                    </li>
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
