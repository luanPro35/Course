import { BlogFormData, BlogPost, BlogStatus } from "@/types/blog.types";

export const createBlogPost = (
  FormData: BlogFormData,
  status: BlogStatus = "draft"
): BlogPost => {
  return {
    id: Date.now(),
    author: FormData.author,
    title: FormData.title,
    content: FormData.content,
    category: FormData.category,
    image: FormData.image,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status,
  };
};

export const validateForm = (FormData: BlogFormData): string[] => {
  const errors: string[] = [];

  if (!FormData.author.trim()) errors.push("Vui lòng nhập tên tác giả.");
  if (!FormData.title.trim()) errors.push("Vui lòng nhập tiêu đề bài viết.");
  if (!FormData.content.trim()) errors.push("Vui lòng nhập nội dung.");
  if (!FormData.category.trim()) errors.push("Vui lòng chọn danh mục.");
  if (!FormData.image.trim()) errors.push("Vui lòng thêm ảnh bìa.");

  return errors;
};

export const formatImagePath = (fileName: string): string => {
  return `/image/${fileName}`;
};

export const readFileDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
  });
};
