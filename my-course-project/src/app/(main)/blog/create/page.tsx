"use client";
import { useBlogForm } from "@/hooks/useBlogForm";
import { BLOG_CATEGORIES, TIPS } from "@/constants/blog.constants";
import { BookOpen, Eye, FileText, Loader2, Tag, User } from "lucide-react";
import { BlogPreview } from "./BlogPreview";
import React, { ComponentType, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogService } from "@/services/blog.service";
import { BlogPost } from "@/types/blog.types";

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
      <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
        <Icon className="w-5 h-5 text-gray-600" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...rest}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all outline-none"
      />
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
      <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
        <Icon className="w-5 h-5 text-gray-600" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...rest}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all outline-none resize-none"
      />
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
      <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
        <Icon className="w-5 h-5 text-gray-600" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...rest}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all outline-none bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default function CreateBlogPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const {
    formData,
    errors,
    isSubmitting,
    isUploading,
    imagePreview,
    handleChange,
    handleImageChange,
    handleSubmit,
    setFormData,
    setImagePreview,
  } = useBlogForm({
    id: 0,
    author: "",
    title: "",
    content: "",
    category: "",
    image: "",
    fullContent: "",
  });

  useEffect(() => {
    if (postId) {
      BlogService.getById(postId)
        .then((post) => {
          if (post) {
            setFormData(post);
            setImagePreview(post.image);
          } else {
            console.error("Post not found for ID:", postId);
            router.push("/blog/create"); // Redirect if post not found
          }
        })
        .catch((err) => {
          console.error("Error fetching post for editing:", err);
          router.push("/blog/create"); // Redirect if post not found or error
        });
    }
  }, [postId, setFormData, setImagePreview, router]);

  const pageTitle = postId ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới";
  const draftButtonText = postId ? "Cập nhật bản nháp" : "Lưu bản nháp";
  const publishButtonText = postId ? "Cập nhật bài viết" : "Xuất bản ngay";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-800 px-8 py-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">{pageTitle}</h2>
                </div>
                <p className="text-gray-300 mt-2">
                  Chia sẻ kiến thức và khóa học của bạn
                </p>
              </div>

              <div className="px-8 py-8">
                {Object.keys(errors).length > 0 && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">
                      Vui lòng kiểm tra lại:
                    </h3>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
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
                  placeholder="VD: TRẢ NGHIỆM HỌC THỬ REACT NATIVE"
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
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Ảnh đại diện <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploading}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer disabled:opacity-50"
                    />
                    {isUploading && (
                      <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
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

                <FormTextarea
                  label="Nội dung đầy đủ"
                  name="fullContent"
                  icon={FileText}
                  required
                  rows={10}
                  value={formData.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleChange(e, "fullContent")
                  }
                  placeholder="Nhập nội dung đầy đủ của bạn tại đây..."
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => handleSubmit("draft", postId ?? undefined)}
                    disabled={isSubmitting || isUploading}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Đang lưu..." : draftButtonText}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSubmit("published", postId ?? undefined)
                    }
                    disabled={isSubmitting || isUploading}
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Đang xuất bản..." : publishButtonText}
                  </button>
                </div>
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
                  formData={formData}
                  imagePreview={imagePreview || ""}
                />

                <div className="mt-6 bg-gray-100 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span> Mẹo viết bài hiệu quả
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    {TIPS.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
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
    </Suspense>
  );
}
