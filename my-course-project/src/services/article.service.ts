import type { Post } from "../types/post";

export async function getArticle(): Promise<Post[]> {
  const response = await fetch("http://localhost:3001/article");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data: Post[] = await response.json();
  return data;
}
