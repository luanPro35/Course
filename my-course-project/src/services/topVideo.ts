import { TopVideo } from "@/types/topVideo";

export async function getTopVideos(): Promise<TopVideo[]> {
  const response = await fetch("http://localhost:3001/topVideos");
  if (!response.ok) {
    throw new Error("Failed to fetch top videos");
  }
  const data: TopVideo[] = await response.json();
  return data;
}
