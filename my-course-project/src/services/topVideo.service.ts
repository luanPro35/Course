import { TopVideo } from "@/types/topVideo";

export const TOP_VIDEO_API_URL = "http://localhost:3001/topVideos";
export async function getTopVideos(): Promise<TopVideo[]> {
  const response = await fetch(TOP_VIDEO_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch top videos");
  }
  const data: TopVideo[] = await response.json();
  return data;
}
