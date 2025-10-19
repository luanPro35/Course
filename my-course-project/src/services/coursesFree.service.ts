import type { CourseFree } from "@/types/courseFree";

export const FREE_API_URL = "http://localhost:3001/coursesFree";
export const getCourses = async (): Promise<CourseFree[]> => {
  const res = await fetch(FREE_API_URL, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
};
