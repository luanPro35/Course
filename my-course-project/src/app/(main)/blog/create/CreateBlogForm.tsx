"use client";
import React from "react";
import { useBlogForm } from "@/hooks/useBlogForm";
import { BLOG_CATEGORIES, TIPS } from "@/constants/blog.constants";
import { FileText, Tag, User } from "lucide-react";

// Import các component con
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { ImageUpload } from "./ImageUpload";
import { ErrorMessages } from "./ErrorMessages";
import { FormActions } from "./FormActions";
import { FormHeader } from "./FormHeader";
import { TipsSection } from "./TipsSection";
import { BlogPreview } from "./BlogPreview";

export default function CreateBlogPost() {
  const {
    formData,
    errors,
    isSubmitting,
    isUploading,
    imagePreview,
    handleChange,
    handleImageChange,
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
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <FormHeader
              title="Tạo Bài Viết Mới"
              subtitle="Chia sẻ kiến thức và khóa học của bạn"
              variant="form"
            />

            <div className="px-8 py-8">
              <ErrorMessages errors={errors} />

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
                placeholder="VD: TRẢI NGHIỆM HỌC THỬ REACT NATIVE"
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

              <ImageUpload
                onChange={handleImageChange}
                image={formData.image}
                imagePreview={imagePreview || ""}
              />

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

              <FormActions
                onDraft={() => handleSubmit("draft")}
                onPublish={() => handleSubmit("published")}
                isSubmitting={isSubmitting}
                isUploading={isUploading}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <FormHeader
              title="Xem trước"
              subtitle="Bài viết sẽ hiển thị như thế này"
              variant="preview"
            />

            <div className="p-8">
              <BlogPreview
                formData={formData}
                imagePreview={imagePreview || ""}
              />

              <TipsSection tips={TIPS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
