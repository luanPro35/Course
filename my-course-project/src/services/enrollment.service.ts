import { enrollCourse } from "./api.service";

export interface EnrollmentResponse {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  status: string;
}

export interface CourseEnrollmentResponse {
  id: string;
  title: string;
  thumbnailUrl: string;
  description?: string;
  price: number;
  enrolledAt: string;
  progress?: number;
  status?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const enrollInFreeCourse = async (
  courseId: string | number,
  token: string
): Promise<EnrollmentResponse> => {
  try {
    const response = await fetch(
      `http://localhost:8080/project/enrollments/free/${courseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể ghi danh khóa học");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error enrolling in free course:", error);
    throw error;
  }
};

export const getEnrolledCourses = async (
  token: string,
  page: number = 0,
  size: number = 10
): Promise<PageResponse<CourseEnrollmentResponse>> => {
  try {
    const response = await fetch(
      `${enrollCourse}?page=${page}&size=${size}&sort=enrolledAt,desc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Không thể lấy danh sách khóa học"
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw error;
  }
};
