import type { CourseFree } from "@/types/courseFree";
import { FREE_API_URL } from "@/services/api.service";

export const getCourseById = async (id: string): Promise<CourseFree | null> => {
  try {
    const res = await fetch(`http://localhost:8080/project/courses/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error("Failed to fetch course by ID:", res.statusText);
      throw new Error("Failed to fetch course by ID");
    }

    const result = await res.json();
    const data: CourseFree = result?.data || null;
    return data;
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    throw error;
  }
};

export const getAllCourses = async (): Promise<CourseFree[]> => {
  try {
    const res = await fetch(FREE_API_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch free courses:", res.statusText);
      return [];
    }

    const result = await res.json();
    const data: CourseFree[] = result?.data?.content || [];
    const freeCourses = data.filter(course => course.price === 0);
    return freeCourses;
  } catch (error) {
    console.error("Error fetching free courses:", error);
    return [];
  }
};
