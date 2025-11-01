import { TopVideo } from "@/types/topVideo";
import { TOP_VIDEO_API_URL } from "@/services/api.service";
export async function getTopVideos(): Promise<TopVideo[]> {
  const response = await fetch(TOP_VIDEO_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch top videos");
  }
  const data: TopVideo[] = await response.json();
  return data;
}
