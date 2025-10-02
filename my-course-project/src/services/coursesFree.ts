import { Course } from "@/types/courseFree";

export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch("/api/coursesFree");

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
};
