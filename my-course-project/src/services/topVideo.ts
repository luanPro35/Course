import { TopVideo } from "@/types/topVideo";

export const getTopVideos = async (): Promise<TopVideo[]> => {
  const res = await fetch("/api/topVideos");

  if (!res.ok) {
    throw new Error("Failed to fetch top videos");
  }

  return res.json();
};
