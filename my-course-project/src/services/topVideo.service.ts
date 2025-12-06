import { TopVideo } from "@/types/topVideo";


export async function getTopVideos(): Promise<TopVideo[]> {
  
  
  console.warn("Top videos feature is not available - backend endpoint missing");
  return [];
  
  
}
