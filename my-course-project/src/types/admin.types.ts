export interface Admin {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: "admin" | "editor" | "superadmin";
  createdAt: Date;
}


export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}


export interface Lesson {
  id?: number;
  title: string;
  contentUrl: string;
  orderIndex: number;
  durationInMinutes?: number;
}


export interface Section {
  id?: number;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}


export interface AdminCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  sections: Section[];
  creator: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  
  badge?: string;
  heroTitle?: string;
  titleHighlight?: string;
  subtitle?: string;
  subtitleHighlights?: { text: string; isHighlight: boolean }[];
  stats?: {
    projects: string;
    exercises: string;
    access: string;
    support: string;
  };
  learningOutcomes?: string[];
}


export interface CreateCourseDTO {
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  sections: Section[];
  badge?: string;
  heroTitle?: string;
  titleHighlight?: string;
  subtitle?: string;
  subtitleHighlights?: string; 
  stats?: string; 
  learningOutcomes?: string; 
  status?: string;
}


export interface UpdateCourseDTO {
  title?: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  badge?: string;
  heroTitle?: string;
  titleHighlight?: string;
  subtitle?: string;
  subtitleHighlights?: string; 
  stats?: string; 
  learningOutcomes?: string;
  sections?: Section[];
}


export interface PaginatedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}


export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}


export enum CourseType {
  FREE = "FREE",
  PRO = "PRO",
}
