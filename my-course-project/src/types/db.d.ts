import { User, CourseFree, Lesson, Section } from "./user";

export interface Course {
  id: string;
  title: string;
  image?: string;
  price?: number;
  author?: string;
  numberOfPosts?: number;
  totalTime?: string;
  free?: string;
  people?: number;
  contentSection?: string;
  titleSection?: string;
  section?: Section | Section[];
}



export { User, CourseFree, Lesson, Section };

export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  image: string;
  status: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  image: string;
  status: string;
  createdAt: string;
  fullContent?: string;
}

export interface Article {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  timeAgo: string;
  readTime: string;
  image: string;
}

export interface Trending {
  id: string;
  image: string;
  title: string;
  author: string;
  time_posts: string;
}

export interface Information {
  id: string;
  fullName: string;
  avatar: string;
  about: string;
  personalWebsite: string;
  github: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
}

export interface SavedItem {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  image: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  fullName: string;
  about: string;
  avatar: string;
  personalWebsite: string;
  github: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  name?: string;
}

export interface Video {
  id: string;
  image: string;
  time: string;
  title: string;
  numberOfEyes: number;
  numberOfLike: number;
  numberOfComment: number;
  url: string;
}

export interface DbData {
  posts: Post[];
  users: User[];
  informations: Information[];
  saved: SavedItem[];
  blogs: Blog[];
  upload: unknown[]; 
  coursesFree: CourseFree[]; 
  coursesPro: Course[];
  article: Article[];
  trending: Trending[];
  profile: Profile[];
  register: unknown[]; 
  topVideos: Video[];
}
