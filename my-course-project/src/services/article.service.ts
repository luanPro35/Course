import type { Post } from "../types/post";
import { getPublishedArticlesURL } from "./api.service";

export async function getArticle(page: number, size: number): Promise<Post[]> {
  const response = await fetch(getPublishedArticlesURL(page, size), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  const data: Post[] = await response.json();
  return data;
}
