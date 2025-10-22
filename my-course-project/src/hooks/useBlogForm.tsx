"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { BlogService } from "@/services/blog.service";
import { BlogFormData, BlogPost } from "@/types/blog.types";

export const useBlogForm = (initialState: BlogFormData) => {
  const [formData, setFormData] = useState<BlogFormData>(initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // State for image upload

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
            const res = await fetch("/api/upload", {
              method: "POST",
              body: uploadFormData,
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
              throw new Error(result.error || "Tải ảnh lên thất bại.");
            }
            const imageUrl = `\n![Image](${result.path})\n`;
            const currentContent = formData.fullContent || "";
            setFormData((prev) => ({
              ...prev,
              fullContent: currentContent + imageUrl,
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

    // Set uploading state
    setIsUploading(true);
    setErrors((prev) => ({ ...prev, image: undefined })); // Clear previous image error

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Tải ảnh lên thất bại.");
      }

      // On successful upload, update the form data with the REAL path
      setFormData((prev) => ({ ...prev, image: result.path }));
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        image: "Lỗi khi tải ảnh lên. Vui lòng thử lại.",
      }));
    } finally {
      // Unset uploading state
      setIsUploading(false);
    }
  };

  const handleSubmit = async (
    status: "draft" | "published",
    postId?: number | string
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

    setIsSubmitting(true);

    try {
      if (postId) {
        // Update existing post
        await BlogService.update(postId, formData, status);
        alert(`Bài viết đã được cập nhật dưới dạng ${status}`);
      } else {
        // Create new post
        await BlogService.create(formData, status);
        alert(`Bài viết đã được lưu dưới dạng ${status}`);
        resetForm(); // Reset the form after successful creation
      }
      // Optionally reset form or redirect
      // setFormData(initialState);
    } catch (error) {
      console.error("Failed to save the post:", error);
      alert("Có lỗi xảy ra khi lưu bài viết.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    isUploading, // Expose uploading state to the component
    imagePreview,
    setImagePreview, // Expose setImagePreview
    handleChange,
    handleImageChange, // Use this new handler for the file input
    handlePaste,
    handleSubmit,
    resetForm, // Expose the reset function
  };
};
