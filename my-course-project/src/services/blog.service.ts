import { BlogFormData, BlogPost, BlogStatus } from "@/types/blog.types";

export class BlogService {
  static async getAll(): Promise<BlogPost[]> {
    const res = await fetch("/api/blogs", { cache: "no-store" });
    if (!res.ok) throw new Error("Không thẻ tải được danh sách bài");
    return res.json();
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
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Lỗi khi tạo bài viết");
    }
    return await res.json();
  }
}
