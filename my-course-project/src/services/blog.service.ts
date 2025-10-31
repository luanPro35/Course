import { BlogFormData, BlogPost, BlogStatus } from "../types/blog.types";
import { User } from "@/types/user";

const USERS_API_URL = "http://localhost:3001/users";

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
  }
}
