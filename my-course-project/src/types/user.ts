import { Course } from "./course";
import { Post } from "./post";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  about?: string;
  avatar?: string;
  personalWebsite?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  courses?: Course[]; // Courses directly associated with the user
}

export interface Information {
  id: string;
  fullName: string;
  avatar?: string;
  about?: string;
  personalWebsite?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
}

export interface TrendingItem {
  id: string;
  image: string;
  title: string;
  author: string;
  time_posts: string;
}

export interface TopVideo {
  id: string;
  image: string;
  time: string;
  title: string;
  numberOfEyes: number;
  numberOfLike: number;
  numberOfComment: number;
  url: string;
}

export interface DbJson {
  posts: Post[];
  users: User[];
  informations: Information[];
  saved: unknown[];
  blogs: Post[];
  upload: unknown[];
  "my-courses": { userId: string; course: Course }[];
  coursesFree: Course[];
  coursesPro: Course[];
  article: Post[];
  trending: TrendingItem[];
  profile: Information[]; // Assuming profile items are similar to Information
  register: unknown[];
  topVideos: TopVideo[];
}
