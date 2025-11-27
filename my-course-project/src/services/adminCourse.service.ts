import {
  AdminCourse,
  CreateCourseDTO,
  UpdateCourseDTO,
  CourseStatus,
  PaginatedResponse,
  ApiResponse,
} from "@/types/admin.types";
import {
  CREATE_COURSE_URL,
  getCourseByAdminIdURL,
  updateCourseByAdminURL,
  deleteCourseByAdminURL,
  updateCourseStatusURL,
  getCoursesByStatusURL,
  getAllCoursesAdminURL,
} from "@/services/api.service";

export async function createCourse(
  courseData: CreateCourseDTO
): Promise<AdminCourse> {
  const token = localStorage.getItem("accessToken");
  
  console.log("Creating course with data:", courseData);
  
  const response = await fetch(CREATE_COURSE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    let errorMessage = `Failed to create course (${response.status})`;
    try {
      const error = await response.json();
      console.error("Backend error response:", error);
      errorMessage = error.message || errorMessage;
    } catch (e) {
      const text = await response.text();
      console.error("Backend error text:", text);
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const result: ApiResponse<AdminCourse> = await response.json();
  return result.data;
}

export async function getCourseById(id: number): Promise<AdminCourse | null> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(getCourseByAdminIdURL(id), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch course");
  }

  const result: ApiResponse<AdminCourse> = await response.json();
  return result.data;
}

export async function updateCourse(
  id: number,
  courseData: UpdateCourseDTO
): Promise<AdminCourse> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(updateCourseByAdminURL(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update course");
  }

  const result: ApiResponse<AdminCourse> = await response.json();
  return result.data;
}

export async function deleteCourse(id: number): Promise<void> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(deleteCourseByAdminURL(id), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete course");
  }
}

export async function updateCourseStatus(
  id: number,
  status: CourseStatus
): Promise<AdminCourse> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(updateCourseStatusURL(id, status), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update course status");
  }

  const result: ApiResponse<AdminCourse> = await response.json();
  return result.data;
}

export async function getCoursesByStatus(
  status: CourseStatus,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<AdminCourse>> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(getCoursesByStatusURL(status, page, size), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result: ApiResponse<PaginatedResponse<AdminCourse>> =
    await response.json();
  return result.data;
}

export async function getAllCourses(
  page: number = 10,
  size: number = 10
): Promise<PaginatedResponse<AdminCourse>> {
  const token = localStorage.getItem("accessToken");
  const url = getAllCoursesAdminURL(page, size);
  
  console.log("Fetching all courses from:", url);
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch courses (${response.status})`;
    try {
      const error = await response.json();
      console.error("Backend error response:", error);
      errorMessage = error.message || errorMessage;
    } catch (e) {
      const text = await response.text();
      console.error("Backend error text:", text);
    }
    throw new Error(errorMessage);
  }

  const result: ApiResponse<PaginatedResponse<AdminCourse>> =
    await response.json();
  return result.data;
}
