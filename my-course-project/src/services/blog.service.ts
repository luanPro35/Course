import { BlogFormData, BlogPost, BlogStatus } from "@/types/blog.types";

// Sử dụng json-server API endpoint
export const API_BASE_URL = "http://localhost:3001/blogs";
export class BlogService {
  static async getAll(): Promise<BlogPost[]> {
    const res = await fetch(API_BASE_URL, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Không thể tải được danh sách bài viết");
    return res.json();
  }

  static async getById(id: number | string): Promise<BlogPost | null> {
    const res = await fetch(`${API_BASE_URL}/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      const errorText = await res.text();
      throw new Error(errorText || "Không thể tải được bài viết");
    }
    return res.json();
  }

  static async update(
    id: number | string,
    data: BlogFormData,
    status?: BlogStatus
  ): Promise<BlogPost> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Lỗi khi cập nhật bài viết");
    }
    return await res.json();
  }

  static async create(
    data: BlogFormData,
    status: BlogStatus = "draft"
  ): Promise<BlogPost> {
    // Loại bỏ ID một cách tường minh để json-server tự tạo ID mới
    const postData = {
      author: data.author,
      title: data.title,
      content: data.content,
      category: data.category,
      image: data.image,
      status,
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Lỗi khi tạo bài viết");
    }
    return await res.json();
  }

  static async delete(id: number | string): Promise<void> {
    // Đảm bảo id luôn là chuỗi để phù hợp với cách json-server xử lý
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Lỗi khi xóa bài viết: ${errorText} (status: ${res.status})`
      );
      throw new Error(
        errorText || `Lỗi khi xóa bài viết (status: ${res.status})`
      );
    }
    // Không cần trả về gì khi xóa thành công
  }
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const res = await fetch(API_BASE_URL, { cache: "no-store" });
  return res.json();
};

export const getBlogPost = async (id: string): Promise<BlogPost> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  return res.json();
};

export const createBlogPost = async (
  post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<BlogPost> => {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
  return res.json();
};

export const updateBlogPost = async (
  id: string,
  post: Partial<BlogPost>
): Promise<BlogPost> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
  return res.json();
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
};
