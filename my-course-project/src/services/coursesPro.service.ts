import type { CoursePro } from "@/types/coursePro";
export const PRO_API_URL = "http://localhost:3001/coursesPro";
export async function getCourses(): Promise<CoursePro[]> {
  const response = await fetch(PRO_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data: CoursePro[] = await response.json();
  return data;
}
