import type { CoursePro } from "@/types/coursePro";
import { PRO_API_URL } from "@/services/api.service";
export async function getCourses(): Promise<CoursePro[]> {
  const response = await fetch(PRO_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data: CoursePro[] = await response.json();
  return data;
}

export async function getCourseById(id: string): Promise<CoursePro | null> {
  const response = await fetch(`${PRO_API_URL}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch course");
  }
  const data: CoursePro = await response.json();
  return data;
}
