import { getAllUsersURL, deleteUserURL } from "./api.service";

export interface EnrolledCourseInfo {
  courseId: number;
  courseTitle: string;
  courseThumbnail: string;
  enrolledAt: string;
}

export interface UserWithEnrollments {
  id: number;
  email: string;
  fullName: string | null;
  avatar: string | null;
  phone: string | null;
  createdAt: string | null;
  roles: string[];
  enrolledCourses: EnrolledCourseInfo[];
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getAllUsers = async (
  page: number = 0,
  size: number = 25
): Promise<PageResponse<UserWithEnrollments>> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Vui lòng đăng nhập để xem danh sách người dùng");
    }

    const response = await fetch(getAllUsersURL(page, size), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể lấy danh sách người dùng");
    }

    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err instanceof Error
      ? err
      : new Error("Không thể lấy danh sách người dùng");
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Vui lòng đăng nhập để xóa người dùng");
    }

    const response = await fetch(deleteUserURL(userId), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể xóa người dùng");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err instanceof Error ? err : new Error("Không thể xóa người dùng");
  }
};
