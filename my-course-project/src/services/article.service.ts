import type { Post } from "../types/post";

export const ARTICLE_API_URL = "http://localhost:3001/article";

export async function getArticle(): Promise<Post[]> {
  const response = await fetch(ARTICLE_API_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  const data: Post[] = await response.json();
  return data;
}