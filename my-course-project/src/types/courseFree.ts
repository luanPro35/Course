export interface CourseFree {
  id: string;
  thumbnailUrl: string;
  title: string;
  free: string;
  people: number;
  numberOfPosts: number;
  totalTime: string;
  price: number;
  sections?: Section[];
  contentSection: string;
  titleSection: string;
  isCompleted?: boolean;
  status?: string;
}

export interface Lesson {
  id: string;
  title: string;
  contentUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  totalLesson: number;
  isExpanded?: boolean;
}
