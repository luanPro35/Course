"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { BlogService } from "@/services/blog.service";
import { getTokens } from "@/utils/token";
import { BlogFormData } from "@/types/blog.types";

export const useBlogForm = (initialState: BlogFormData) => {
  const [formData, setFormData] = useState<BlogFormData>(initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // Track the file object for FormData
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 

  const resetForm = () => {
    setFormData(initialState);
    setImagePreview(null);
    setErrors({});
  };

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    } else {
      setImagePreview(null);
    }
  }, [formData.image]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    name: string
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (const index in items) {
      const item = items[index];
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          setIsUploading(true);
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);

          try {
            const { accessToken } = getTokens();
            const headers = accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : undefined;
            
            const { UPLOAD_IMAGE_POST_URL } = await import("@/services/api.service");
            const res = await fetch(UPLOAD_IMAGE_POST_URL, {
              method: "POST",
              headers,
              body: uploadFormData,
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
              throw new Error(result.error || "Tải ảnh lên thất bại.");
            }
            const imageUrl = result.data || result.path || result.url;
            const imageMarkdown = `\n![Image](${imageUrl})\n`;
            const currentContent = formData.fullContent || "";
            setFormData((prev) => ({
              ...prev,
              fullContent: currentContent + imageMarkdown,
            }));
          } catch (error) {
            console.error(error);
            setErrors((prev) => ({
              ...prev,
              image: "Lỗi khi tải ảnh lên. Vui lòng thử lại.",
            }));
          } finally {
            setIsUploading(false);
          }
        }
      }
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setImageFile(file);
    
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    setFormData((prev) => ({ ...prev, image: previewUrl }));
    
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (
    status: "draft" | "published",
    userId: string | null,
    token: string | null,
    postId?: number | string,
    router?: AppRouterInstance
  ) => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.author) newErrors.author = "Tên tác giả là bắt buộc";
    if (!formData.title) newErrors.title = "Tiêu đề là bắt buộc";
    if (!formData.content) newErrors.content = "Nội dung là bắt buộc";
    if (!formData.fullContent)
      newErrors.fullContent = "Nội dung đầy đủ là bắt buộc";
    if (!formData.category) newErrors.category = "Danh mục là bắt buộc";
    if (!formData.image) newErrors.image = "Ảnh đại diện là bắt buộc";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!userId) {
      setErrors((prev) => ({ ...prev, userId: "User ID is required" }));
      alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    if (!token) {
      setErrors((prev) => ({
        ...prev,
        token: "Authentication token is missing",
      }));
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        "Submitting blog post with userId:",
        userId,
        "token:",
        token ? "present" : "missing"
      );

      if (postId) {
        await BlogService.update(
          parseInt(postId.toString(), 10),
          {
            ...formData,
            status,
          },
          imageFile || undefined // Pass the file object for FormData upload
        );
        alert(
          `Bài viết đã được cập nhật dưới dạng ${
            status === "draft" ? "bản nháp" : "xuất bản"
          }`
        );
      } else {
        await BlogService.create(formData, status, imageFile || undefined);
        alert(
          `Bài viết đã được lưu dưới dạng ${
            status === "draft" ? "bản nháp" : "xuất bản"
          }`
        );
        resetForm(); 
      }

      
      if (router) {
        router.push("/blog/my-posts");
      }
    } catch (error) {
      console.error("Failed to save the post:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lưu bài viết.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    isUploading, 
    imagePreview,
    setImagePreview, 
    handleChange,
    handleImageChange, 
    handlePaste,
    handleSubmit,
    resetForm, 
  };
};
