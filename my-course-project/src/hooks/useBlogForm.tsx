"use client";
import { useState } from "react";
import { BlogFormData } from "@/types/blog.types";
import { BlogService } from "@/services/blog.service";
import {
  formatImagePath,
  readFileDataUrl,
  validateForm,
} from "@/utils/blog.utils";
import { BlogPost } from "@/types/blog.types";

export const useBlogForm = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    author: "",
    title: "",
    content: "",
    category: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error.length > 0) {
      setError([]);
    }
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await readFileDataUrl(file);
      setImagePreview(dataUrl);
      handleChange("image", formatImagePath(file.name));
    } catch (error) {
      console.error("Error reading file:", error);
      const errorMessage = ["Không thể đọc file ảnh"];
      setError(errorMessage);
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setError([]);
    const newErrors: Record<string, string> = {};

    if (!formData.author) newErrors.author = "Tên tác giả là bắt buộc";
    if (!formData.title) newErrors.title = "Tiêu đề là bắt buộc";
    if (!formData.content) newErrors.content = "Nội dung là bắt buộc";
    if (!formData.category) newErrors.category = "Danh mục là bắt buộc";
    if (!formData.image) newErrors.image = "Ảnh đại diện là bắt buộc";

    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors));
      return;
    }

    setIsSubmitting(true);

    try {
      const postData: BlogPost = {
        ...formData,
        status,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      await BlogService.create(postData, status);
      alert(`Bài viết đã được lưu dưới dạng ${status}`);
      // Reset form or redirect user
    } catch (error) {
      console.error("Failed to save the post:", error);
      alert("Có lỗi xảy ra khi lưu bài viết.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    imagePreview,
    errors: error,
    isSubmitting,
    handleChange,
    handleImageChange,
    handleSubmit,
  };
};
