import { BlogFormData, BlogPost, BlogStatus } from "@/types/blog.types";

// Sử dụng json-server API endpoint
const API_BASE_URL = "http://localhost:3001/posts";

export class BlogService {
  static async getAll(): Promise<BlogPost[]> {
    const res = await fetch(API_BASE_URL, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Không thể tải được danh sách bài viết");
    return res.json();
  }

  static async getById(id: number | string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE_URL}/${id}`, { cache: "no-store" });
    if (!res.ok) {
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
    const { id, ...restData } = data; // Loại bỏ ID khỏi dữ liệu
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...restData,
        status,
        createdAt: new Date().toISOString(),
      }),
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
