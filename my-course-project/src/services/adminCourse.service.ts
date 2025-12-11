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
  const formData = new FormData();
  
  const requestBlob = new Blob([JSON.stringify(courseData)], {
    type: 'application/json'
  });
  formData.append("request", requestBlob);
  
  const response = await fetch(CREATE_COURSE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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
  const cleanCourseData = JSON.parse(JSON.stringify(courseData));
  
  if (cleanCourseData.sections) {
    cleanCourseData.sections = cleanCourseData.sections.map((section: any) => {
      const { id, ...sectionRest } = section;
      const cleanLessons = section.lessons?.map((lesson: any) => {
        const { id, ...lessonRest } = lesson;
        return lessonRest;
      });
      return { ...sectionRest, lessons: cleanLessons };
    });
  }

  console.log("Updating course ID:", id);
  console.log("Update data (cleaned):", cleanCourseData);
  
  const formData = new FormData();
  
  const requestBlob = new Blob([JSON.stringify(cleanCourseData)], {
    type: 'application/json'
  });
  formData.append("request", requestBlob);
  
  const response = await fetch(updateCourseByAdminURL(id), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `Failed to update course (${response.status})`;
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
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<AdminCourse>> {
  const token = localStorage.getItem("accessToken");
  
  const url = getCoursesByStatusURL("PUBLISHED", page, size);
  
  console.log("Fetching all courses from:", url);
  
  try {
    const [publishedResponse, draftResponse] = await Promise.all([
      fetch(getCoursesByStatusURL("PUBLISHED", 0, 100), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(getCoursesByStatusURL("DRAFT", 0, 100), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (!publishedResponse.ok || !draftResponse.ok) {
      let errorMessage = `Failed to fetch courses`;
      try {
        const error = await (publishedResponse.ok ? draftResponse : publishedResponse).json();
        console.error("Backend error response:", error);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        console.error("Error parsing response");
      }
      throw new Error(errorMessage);
    }

    const publishedResult: ApiResponse<PaginatedResponse<AdminCourse>> = await publishedResponse.json();
    const draftResult: ApiResponse<PaginatedResponse<AdminCourse>> = await draftResponse.json();

    const allCourses = [
      ...publishedResult.data.content,
      ...draftResult.data.content,
    ];

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedCourses = allCourses.slice(startIndex, endIndex);

    return {
      content: paginatedCourses,
      totalPages: Math.ceil(allCourses.length / size),
      totalElements: allCourses.length,
      pageSize: size,
      pageNo: page,
      last: page >= Math.ceil(allCourses.length / size) - 1,
    };
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
}
