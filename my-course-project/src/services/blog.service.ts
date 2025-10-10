import { BlogFormData, BlogPost, BlogStatus } from "@/types/blog.types";

export class BlogService {
  static async getAll(): Promise<BlogPost[]> {
    const res = await fetch("/api/blogs", { cache: "no-store" });
    if (!res.ok) throw new Error("Không thẻ tải được danh sách bài");
    return res.json();
  }

  static async getById(id: number): Promise<BlogPost> {
    const res = await fetch(`/api/blogs/${id}`, { cache: "no-store" });
    if (!res.ok) {
      try {
        const errorData = await res.json();
        throw new Error(errorData.error || "Không thể tải được bài viết");
      } catch {
        throw new Error("Không thể tải được bài viết");
      }
    }
    return res.json();
  }

  static async update(
    id: number,
    data: BlogFormData,
    status?: BlogStatus
  ): Promise<BlogPost> {
    const res = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status }),
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        throw new Error(errorData.error || "Lỗi khi cập nhật bài viết");
      } catch {
        throw new Error("Lỗi khi cập nhật bài viết");
      }
    }
    return await res.json();
  }

  static async create(
    data: BlogFormData,
    status: BlogStatus = "draft"
  ): Promise<BlogPost> {
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status }),
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        throw new Error(errorData.error || "Lỗi khi tạo bài viết");
      } catch {
        throw new Error("Lỗi khi tạo bài viết");
      }
    }
    return await res.json();
  }

  static async delete(id: number): Promise<void> {
    const res = await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        throw new Error(errorData.error || "Lỗi khi xóa bài viết");
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message || "Lỗi khi xóa bài viết");
        } else {
          throw new Error("Lỗi khi xóa bài viết");
        }
      }
    }
  }
}
