import { CardTrending } from "@/types/trending";
export const TRENDING_API_URL = "http://localhost:3001/trending";
export const getCourses = async (): Promise<CardTrending[]> => {
  const res = await fetch(TRENDING_API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
};
