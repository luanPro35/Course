import { BlogFormData, BlogPost, BlogStatus } from "../types/blog.types";
import { User } from "@/types/user";
import type { Post } from "@/types/post";

export const API_BASE_URL = "http://localhost:3001/blogs";
const USERS_API_URL = "http://localhost:3001/users";
const ARTICLE_API_URL = "http://localhost:3001/article";

export class BlogService {
  static async create(
    data: BlogFormData,
    userId: number | string,
    status: BlogStatus = "draft"
  ): Promise<BlogPost> {
    const userResponse = await fetch(`${USERS_API_URL}/${userId}`);
    if (!userResponse.ok) {
      throw new Error("Không tìm thấy người dùng để thêm bài viết.");
    }
    const user: User = await userResponse.json();

    const newPost: BlogPost = {
      ...data,
      id: Date.now(),
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBlogs = [...(user.blogs || []), newPost];

    const updateUserResponse = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogs: updatedBlogs }),
    });

    if (!updateUserResponse.ok) {
      throw new Error("Lỗi khi cập nhật bài viết cho người dùng.");
    }

    // If status is published, add to article collection
    if (status === "published") {
      console.log("📝 Adding blog to article collection:", newPost.title);
      await this.addToArticle(newPost);
    }

    return newPost;
  }

  static async getAll(): Promise<BlogPost[]> {
    const response = await fetch(USERS_API_URL);
    if (!response.ok) {
      throw new Error("Lỗi khi tải danh sách người dùng.");
    }
    const users: User[] = await response.json();
    const allBlogs = users.flatMap((user) =>
      (user.blogs || []).map((blog) => ({ ...blog, user: user }))
    );
    return allBlogs;
  }

  static async getById(
    userId: number | string,
    blogId: number
  ): Promise<BlogPost | undefined> {
    const userResponse = await fetch(`${USERS_API_URL}/${userId}`);
    if (!userResponse.ok) {
      throw new Error("Không tìm thấy người dùng.");
    }
    const user: User = await userResponse.json();
    console.log("getById called with userId:", userId, "and blogId:", blogId);
    const blog = user.blogs
      ? user.blogs.find((b) => b.id === blogId)
      : undefined;
    return blog ? { ...blog, user: user } : undefined;
  }

  static async update(
    userId: number | string,
    blogId: number,
    data: Partial<BlogFormData>
  ): Promise<BlogPost> {
    const userResponse = await fetch(`${USERS_API_URL}/${userId}`);
    if (!userResponse.ok) {
      throw new Error("Không tìm thấy người dùng.");
    }
    const user: User = await userResponse.json();

    const blogIndex = (user.blogs || []).findIndex((b) => b.id === blogId);
    if (blogIndex === -1) {
      throw new Error("Không tìm thấy bài viết để cập nhật.");
    }

    const oldBlog = user.blogs ? user.blogs[blogIndex] : null;
    const oldStatus = oldBlog?.status;

    const updatedBlog: BlogPost = {
      ...(user.blogs ? user.blogs[blogIndex] : {}),
      ...(user.blogs && user.blogs[blogIndex]
        ? {
            id: user.blogs[blogIndex].id,
            author: user.blogs[blogIndex].author || "",
            title: user.blogs[blogIndex].title || "",
            content: user.blogs[blogIndex].content || "",
            fullContent: user.blogs[blogIndex].fullContent || "",
            category: user.blogs[blogIndex].category || "",
            image: user.blogs[blogIndex].image || "",
          }
        : {
            id: 0,
            author: "",
            title: "",
            content: "",
            fullContent: "",
            category: "",
            image: "",
          }),
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const updatedBlogs = user.blogs || [];
    updatedBlogs[blogIndex] = updatedBlog;

    const updateUserResponse = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogs: updatedBlogs }),
    });

    if (!updateUserResponse.ok) {
      throw new Error("Lỗi khi cập nhật bài viết.");
    }

    // Handle article collection updates based on status change
    const newStatus = updatedBlog.status;
    
    if (oldStatus === "draft" && newStatus === "published") {
      // Changed from draft to published - add to article
      await this.addToArticle(updatedBlog);
    } else if (oldStatus === "published" && newStatus === "draft") {
      // Changed from published to draft - remove from article
      await this.removeFromArticle(blogId);
    } else if (newStatus === "published") {
      // Already published, just update the article
      await this.updateArticle(updatedBlog);
    }

    return updatedBlog;
  }

  static async delete(userId: number | string, blogId: number): Promise<void> {
    const userResponse = await fetch(`${USERS_API_URL}/${userId}`);
    if (!userResponse.ok) {
      console.error(
        "User not found in BlogService.delete with userId:",
        userId
      );
      return;
    }
    const user: User = await userResponse.json();

    const blogToDelete = (user.blogs || []).find((b) => b.id === blogId);
    const updatedBlogs = (user.blogs || []).filter((b) => b.id !== blogId);

    if (updatedBlogs.length === (user.blogs || []).length) {
      throw new Error("Không tìm thấy bài viết để xóa.");
    }

    const updateUserResponse = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogs: updatedBlogs }),
    });

    if (!updateUserResponse.ok) {
      throw new Error("Lỗi khi xóa bài viết.");
    }

    // If the deleted blog was published, remove it from article collection
    if (blogToDelete?.status === "published") {
      await this.removeFromArticle(blogId);
    }
  }

  // Helper method to add a blog post to article collection
  private static async addToArticle(blog: BlogPost): Promise<void> {
    try {
      const articlePost: Post = {
        id: blog.id.toString(),
        title: blog.title,
        content: blog.content,
        fullContent: blog.fullContent,
        author: blog.author,
        category: blog.category,
        image: blog.image,
        createdAt: blog.createdAt || new Date().toISOString(),
        timeAgo: this.calculateTimeAgo(blog.createdAt || new Date().toISOString()),
        readTime: this.calculateReadTime(blog.fullContent),
      };

      console.log("🚀 Posting to article API:", ARTICLE_API_URL);
      console.log("📄 Article data:", articlePost);

      const response = await fetch(ARTICLE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articlePost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Successfully added to article collection:", result);
    } catch (error) {
      console.error("❌ Lỗi khi thêm bài viết vào article:", error);
    }
  }

  // Helper method to update an article
  private static async updateArticle(blog: BlogPost): Promise<void> {
    try {
      const articlePost: Post = {
        id: blog.id.toString(),
        title: blog.title,
        content: blog.content,
        fullContent: blog.fullContent,
        author: blog.author,
        category: blog.category,
        image: blog.image,
        createdAt: blog.createdAt || new Date().toISOString(),
        timeAgo: this.calculateTimeAgo(blog.createdAt || new Date().toISOString()),
        readTime: this.calculateReadTime(blog.fullContent),
      };

      await fetch(`${ARTICLE_API_URL}/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articlePost),
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết trong article:", error);
    }
  }

  // Helper method to remove a blog post from article collection
  private static async removeFromArticle(blogId: number): Promise<void> {
    try {
      await fetch(`${ARTICLE_API_URL}/${blogId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Lỗi khi xóa bài viết khỏi article:", error);
    }
  }

  // Helper function to calculate time ago
  private static calculateTimeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    } else {
      return `${diffInYears} năm trước`;
    }
  }

  // Helper function to calculate read time
  private static calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} phút đọc`;
  }
}
