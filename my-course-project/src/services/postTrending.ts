import { CardTrending } from "@/types/trending";

export const getCourses = async (): Promise<CardTrending[]> => {
  const res = await fetch("http://localhost:3001/trending");

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
};
