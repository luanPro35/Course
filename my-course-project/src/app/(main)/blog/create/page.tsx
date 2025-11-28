"use client";
import { useBlogForm } from "@/hooks/useBlogForm";
import { BLOG_CATEGORIES, TIPS } from "@/constants/blog.constants";
import { FileText, Tag, User as UserIcon } from "lucide-react";
import { BlogPreview } from "./BlogPreview";
import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogService } from "@/services/blog.service";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { ImageUpload } from "./ImageUpload";
import { ErrorMessages } from "./ErrorMessages";
import { FormHeader } from "./FormHeader";
import { TipsSection } from "./TipsSection";
import { FormActions } from "./FormActions";
import { useAuth } from "@/hooks/useAuth";

export default function CreateBlogPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const { user, token } = useAuth();

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
    handlePaste,
  } = useBlogForm({
    id: postId ? parseInt(postId, 10) : 0,
    author: "",
    title: "",
    content: "",
    category: "",
    image: "",
    fullContent: "",
  });

  useEffect(() => {
    if (postId && user?.id && token) {
      BlogService.getById(parseInt(postId, 10))
        .then((post) => {
          if (post) {
            setFormData(post);
            setImagePreview(post.image);
          } else {
            console.error("Post not found for ID:", postId);
            router.push("/blog/create");
          }
        })
        .catch((err) => {
          console.error("Error fetching post for editing:", err);
          router.push("/blog/create");
        });
    }
  }, [postId, user?.id, token, setFormData, setImagePreview, router]);

  const pageTitle = postId ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới";
  const draftButtonText = postId ? "Cập nhật bản nháp" : "Lưu bản nháp";
  const publishButtonText = postId ? "Cập nhật bài viết" : "Xuất bản ngay";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <FormHeader
                title={pageTitle}
                subtitle="Chia sẻ kiến thức và khóa học của bạn"
                variant="form"
              />

              <div className="px-8 py-8">
                <ErrorMessages errors={errors} />

                <FormInput
                  label="Tác giả"
                  name="author"
                  icon={UserIcon}
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

                <ImageUpload
                  onChange={handleImageChange}
                  image={formData.image}
                  imagePreview={imagePreview || ""}
                />
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}

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
                  rows={15}
                  value={formData.fullContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleChange(e, "fullContent")
                  }
                  onPaste={handlePaste}
                  placeholder="Nhập nội dung đầy đủ của bài viết..."
                />

                <FormActions
                  onDraft={() =>
                    handleSubmit(
                      "draft",
                      user?.id ?? null,
                      token ?? null,
                      postId ?? undefined,
                      router
                    )
                  }
                  onPublish={() =>
                    handleSubmit(
                      "published",
                      user?.id ?? null,
                      token ?? null,
                      postId ?? undefined,
                      router
                    )
                  }
                  isSubmitting={isSubmitting}
                  isUploading={isUploading}
                />
              </div>
            </div>

            {}
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
    </Suspense>
  );
}
