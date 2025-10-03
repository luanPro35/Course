import { Course } from "@/types/coursePro";

export async function getCourses(): Promise<Course[]> {
  const response = await fetch("/api/coursesPro");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data: Course[] = await response.json();
  return data;
}
