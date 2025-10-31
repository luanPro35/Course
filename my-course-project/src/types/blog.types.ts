import { User } from "@/types/user";

export interface BlogPost {
  id: number;
  author: string;
  title: string;
  content: string;
  fullContent: string;
  category: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "draft" | "published";
  user?: User;
}

export interface BlogFormData {
  id: number;
  author: string;
  title: string;
  content: string;
  fullContent: string;
  category: string;
  image: string;
  updatedAt?: string;
}

export type BlogStatus = "draft" | "published";
