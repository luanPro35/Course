import { CardTrending } from "@/types/trending";
import { TRENDING_API_URL } from "@/services/api.service";

export const getCourses = async (): Promise<CardTrending[]> => {
  const res = await fetch(TRENDING_API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
};
