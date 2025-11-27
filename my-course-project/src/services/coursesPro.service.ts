import type { CoursePro } from "@/types/coursePro";
import { PRO_API_URL } from "@/services/api.service";
export async function getCourses(): Promise<CoursePro[]> {
  try {
    const response = await fetch(PRO_API_URL);
    if (!response.ok) {
      console.error("Failed to fetch pro courses:", response.statusText);
      return [];
    }
    const result = await response.json();
    const allCourses: CoursePro[] = result?.data?.content || [];
    const proCourses = allCourses.filter(course => course.price > 0);
    return proCourses;
  } catch (error) {
    console.error("Error fetching pro courses:", error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<CoursePro | null> {
  try {
    const response = await fetch(`http://localhost:8080/project/courses/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error("Failed to fetch course:", response.statusText);
      throw new Error("Failed to fetch course");
    }
    const result = await response.json();
    const data: CoursePro = result?.data || null;
    return data;
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    throw error;
  }
}
