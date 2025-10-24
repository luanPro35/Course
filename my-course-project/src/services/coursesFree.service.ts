import type { CourseFree } from "@/types/courseFree";

export const FREE_API_URL = "http://localhost:3001/coursesFree";
export const getCourseById = async (id: string): Promise<CourseFree> => {
  const res = await fetch(`${FREE_API_URL}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch course by ID");
  }

  return res.json();
};

export const getAllCourses = async (): Promise<CourseFree[]> => {
  const res = await fetch(FREE_API_URL, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch all courses");
  }

  return res.json();
};
