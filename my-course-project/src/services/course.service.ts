import { CourseFree } from "@/types/courseFree";
import { getMyEnrolledCoursesURL } from "@/services/api.service";

interface CourseEnrollmentResponse {
  courseId: number;
  courseTitle: string;
  courseThumbnail: string;
  enrolledAt?: string;
}

interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const courseService = {
  async getMyCourses(): Promise<CourseFree[]> {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("No access token found");
        return [];
      }

      const response = await fetch(getMyEnrolledCoursesURL(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const pageData: PageResponse<CourseEnrollmentResponse> = result.data;
      const courses: CourseFree[] = pageData.content.map((enrollment) => ({
        id: enrollment.courseId.toString(),
        title: enrollment.courseTitle,
        thumbnailUrl: enrollment.courseThumbnail,
        free: "false",
        people: 0,
        numberOfPosts: 0,
        totalTime: "",
        price: 0,
        contentSection: "",
        titleSection: "",
      }));

      return courses;
    } catch (error) {
      console.error("Error fetching my courses:", error);
      return [];
    }
  },
};
