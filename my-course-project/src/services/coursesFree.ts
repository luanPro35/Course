import type { CourseFree } from "@/types/courseFree";

export const getCourses = async (): Promise<CourseFree[]> => {
  const res = await fetch("/api/coursesFree");

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
};
