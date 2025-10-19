import type { Post } from "../types/post";

export const ARTICLE_API_URL = "http://localhost:3001/article";
export async function getArticle(): Promise<Post[]> {
  const response = await fetch(ARTICLE_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data: Post[] = await response.json();
  return data;
}
