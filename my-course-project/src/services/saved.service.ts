import { BlogPost } from "@/types/blog.types";

export const SAVED_API_URL = "http://localhost:3001/saved";
export class SavedService {
  static async getAll(): Promise<BlogPost[]> {
    try {
      const res = await fetch(`${SAVED_API_URL}`, { cache: "no-store" });
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
      const existingPosts = await this.getAll();
      const numericId = Number(post.id);
      
      if (existingPosts.some((p) => Number(p.id) === numericId)) {
        console.warn(`Post with id ${post.id} is already saved.`);
        return;
      }

      // Ensure id is a number for consistency
      const savedPost = { ...post, id: numericId };

      const res = await fetch(`${SAVED_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedPost),
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

  static async delete(postId: string | number): Promise<void> {
    try {
      // Convert to number to ensure consistency
      const numericId = Number(postId);
      const deleteUrl = `${SAVED_API_URL}/${numericId}`;
      
      console.log("Deleting saved post:", {
        originalId: postId,
        numericId,
        url: deleteUrl
      });
      
      const res = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Failed to delete post: ${res.status} ${res.statusText} - ${errorText}`
        );
        console.error("Delete URL was:", deleteUrl);
        throw new Error("Không thể xóa bài viết");
      }
      
      console.log("Successfully deleted post with id:", numericId);
    } catch (error) {
      console.error("Error in SavedService.delete:", error);
      throw error;
    }
  }
}
