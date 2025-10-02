import { CardTrending } from "@/types/trending";

export const getCourses = async (): Promise<CardTrending[]> => {
  const res = await fetch("/api/Trending");

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
};
