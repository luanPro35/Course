import { BlogPost } from "@/types/blog.types";

export class SavedService {
  static async getAll(): Promise<BlogPost[]> {
    try {
      const res = await fetch("/api/saved", { cache: "no-store" });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Failed to fetch saved posts: ${res.status} ${res.statusText} - ${errorText}`
        );
        throw new Error("Không thể tải danh sách");
      }
      return res.json();
    } catch (error) {
      console.error("Error in SavedService.getAll:", error);
      throw error;
    }
  }

  static async save(post: BlogPost): Promise<void> {
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Failed to save post: ${res.status} ${res.statusText} - ${errorText}`
        );
        throw new Error("Không thể lưu bài viết");
      }
    } catch (error) {
      console.error("Error in SavedService.save:", error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      // Sửa lại đây: Gọi đến API động /api/saved/[id]
      const res = await fetch(`/api/saved/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Failed to delete post: ${res.status} ${res.statusText} - ${errorText}`
        );
        throw new Error("Không thể xóa bài viết");
      }
    } catch (error) {
      console.error("Error in SavedService.delete:", error);
      throw error;
    }
  }
}
