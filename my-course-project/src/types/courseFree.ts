export interface CourseFree {
  id: string;
  image: string;
  title: string;
  free: string;
  people: number;
  numberOfPosts: number;
  totalTime: string;
  price: number;
  section?: Section[];
  contentSection: string;
  titleSection: string;
  isCompleted?: boolean; // Add isCompleted property
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  totalLesson: number;
  isExpanded?: boolean;
}
