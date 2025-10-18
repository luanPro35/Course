import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogService } from "@/services/blog.service";
import { BlogFormData, BlogStatus } from "@/types/blog.types";

export const useBlogForm = (initialState: BlogFormData) => {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof BlogFormData
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // In a real app, you'd upload to a service like Cloudinary or S3
        // For this example, we'll simulate an upload and use a local URL
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
        setFormData({ ...formData, image: preview });
      } catch (error) {
        console.error("Error handling image upload:", error);
        setErrors((prev) => ({
          ...prev,
          image: "Lỗi khi tải ảnh lên.",
        }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Tiêu đề là bắt buộc.";
    if (!formData.author) newErrors.author = "Tên tác giả là bắt buộc.";
    if (!formData.category) newErrors.category = "Danh mục là bắt buộc.";
    if (!formData.content) newErrors.content = "Nội dung là bắt buộc.";
    if (!formData.image) newErrors.image = "Ảnh đại diện là bắt buộc.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: BlogStatus, id?: number) => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let savedPost;
      if (id) {
        savedPost = await BlogService.update(id, formData, status);
      } else {
        savedPost = await BlogService.create(formData, status);
      }
      // Redirect to the 'my-posts' page after successful submission
      router.push("/blog/my-posts");
    } catch (error: unknown) {
      console.error("Failed to save post:", error);
      setErrors((prev) => ({
        ...prev,
        submit: `Lỗi khi lưu bài viết: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
