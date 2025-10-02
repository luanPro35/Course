import { Course } from "@/types/coursePro";

export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch("/api/coursesPro");

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
};
