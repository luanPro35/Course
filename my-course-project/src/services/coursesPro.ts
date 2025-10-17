import type { CoursePro } from "@/types/coursePro";

export async function getCourses(): Promise<CoursePro[]> {
  const response = await fetch("/api/coursesPro");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data: CoursePro[] = await response.json();
  return data;
}
