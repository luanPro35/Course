import { BlogFormData, BlogPost, BlogStatus } from "../types/blog.types";
import {
  USER_API_URL,
  POSTS_API_URL,
  getMyPostsURL,
} from "@/services/api.service";

import { fetchWithAuth } from "@/utils/api.utils";

export class BlogService {
  static async create(
    data: BlogFormData,
    status: BlogStatus
  ): Promise<BlogPost> {
    const postData = {
      title: data.title,
      content: data.content,
      fullContent: data.fullContent,
      author: data.author,
      
      category: data.category?.toLowerCase(),
      thumbnailUrl: data.image, 
      statusPost: status.toUpperCase(), 
    };

    try {
      const response = await fetchWithAuth(POSTS_API_URL, {
        method: "POST",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to create post:", response.status, errorData);
        const errorMessage =
          errorData.message ||
          `Lỗi ${response.status}: Không thể tạo bài viết.`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Post created successfully:", result);
      return result.data as BlogPost;
    } catch (error: unknown) {
      console.error("Failed to create post:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Lỗi khi tạo bài viết.");
    }
  }

  static async getAll(): Promise<BlogPost[]> {
    try {
      const { getPublishedArticlesURL } = await import("@/services/api.service");
      
      const response = await fetch(getPublishedArticlesURL(0, 100), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Error fetching published posts:", response.status);
        return [];
      }

      const result = await response.json();
      const rawList = result?.data?.content ?? result?.data ?? [];
      
      return (Array.isArray(rawList) ? rawList : []).map((post: BlogPost) => {
        const normalizedStatus = String(
          post.statusPost ?? post.status ?? "draft"
        ).toLowerCase() as BlogStatus;

        return {
          id: post.id,
          author: post.author,
          title: post.title,
          content: post.content,
          fullContent: post.fullContent,
          category: post.category,
          image: post.thumbnailUrl || post.image || "",
          status: normalizedStatus,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          user: post.user,
        } as BlogPost;
      });
    } catch (error) {
      console.error("Error fetching all posts:", error);
      return [];
    }
  }

  static async getMyPostsByStatus(status: string): Promise<BlogPost[]> {
    try {
      const response = await fetchWithAuth(getMyPostsURL(status, 0, 50));
      if (!response.ok) {
        throw new Error(`Lỗi khi tải danh sách bài viết với status ${status}.`);
      }

      const result = await response.json();
      const rawList = result?.data?.content ?? result?.data ?? [];
      return (Array.isArray(rawList) ? rawList : []).map((post: BlogPost) => {
        const normalizedStatus = String(
          post.statusPost ?? post.status ?? "draft"
        ).toLowerCase() as BlogStatus;

        return {
          id: post.id,
          author: post.author,
          title: post.title,
          content: post.content,
          fullContent: post.fullContent,
          category: post.category,
          image: post.thumbnailUrl || post.image || "",
          status: normalizedStatus,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          user: post.user,
        } as BlogPost;
      });
    } catch (error) {
      console.error(`Error fetching posts with status ${status}:`, error);
      return [];
    }
  }

  static async getById(blogId: number): Promise<BlogPost | undefined> {
    try {
      console.log("Fetching post with blogId:", blogId);

      const response = await fetchWithAuth(
        `${USER_API_URL}/posts/my-posts/${blogId}`
      );

      if (!response.ok) {
        throw new Error("Không tìm thấy bài viết.");
      }

      const result = await response.json();
      const post = result.data;

      if (!post) {
        return undefined;
      }

      return {
        id: post.id,
        author: post.author,
        title: post.title,
        content: post.content,
        fullContent: post.fullContent,
        category: post.category,
        image: post.image,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      return undefined;
    }
  }

  static async update(
    postId: number,
    data: Partial<BlogFormData>
  ): Promise<BlogPost> {
    const postData = {
      title: data.title,
      content: data.content,
      fullContent: data.fullContent,
      author: data.author,
      category: data.category?.toLowerCase(), 
      thumbnailUrl: data.image,
      statusPost: data.status?.toUpperCase(), 
    };

    try {
      const response = await fetchWithAuth(
        `${USER_API_URL}/posts/my-posts/update-post/${postId}`,
        {
          method: "PUT",
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update post:", response.status, errorData);
        throw new Error("Lỗi khi cập nhật bài viết.");
      }

      const result = await response.json();
      return result.data as BlogPost;
    } catch (error: unknown) {
      console.error("Failed to update post:", error);
      throw new Error("Lỗi khi cập nhật bài viết.");
    }
  }

  static async delete(postId: number): Promise<void> {
    try {
      const response = await fetchWithAuth(
        `${USER_API_URL}/posts/my-posts/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        console.error("Failed to delete post:", response.status, errorText);
        throw new Error("Lỗi khi xóa bài viết.");
      }

      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
}
