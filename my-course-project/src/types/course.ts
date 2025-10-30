export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  video: string;
  votes: number;
  students: number;
  free: boolean;
  price?: number;
  discountPrice?: number;
  updatedAt: string;
}

// Inferred types for courseData based on usage in DynamicCoursePage.tsx
export interface CourseBadge {
  bgColor: string;
  textColor: string;
  icon: string;
  text: string;
}

export interface CourseTitle {
  mainText: string;
  highlightText: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export interface CourseSubtitleHighlight {
  value: string;
}

export interface CourseSubtitle {
  text: string;
  highlights: CourseSubtitleHighlight[];
}

export interface CodeLine {
  color: string;
  indent?: number;
  code: string;
}

export interface CodePreview {
  bgGradientFrom: string;
  bgGradientTo: string;
  isDarkMode: boolean;
  codeLines: CodeLine[];
}

export interface CourseStat {
  value: string;
  label: string;
}

export interface CourseContent {
  badge: CourseBadge;
  headerColor: string;
  title: CourseTitle;
  subtitle: CourseSubtitle;
  codePreview: CodePreview;
  stats: CourseStat[];
  learningPoints: string[];
}

export type CourseType = "html-css" | "javascript-pro" | "sass-advanced"; // Defined in DynamicCoursePage.tsx, but exported here for consistency
export type CourseDataType = Record<CourseType, CourseContent>;
