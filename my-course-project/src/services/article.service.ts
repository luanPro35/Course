import type { Post } from "../types/post";
import { ARTICLE_API_URL } from "./api.service";

export async function getArticle(): Promise<Post[]> {
  const response = await fetch(ARTICLE_API_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  const data: Post[] = await response.json();
  return data;
}
