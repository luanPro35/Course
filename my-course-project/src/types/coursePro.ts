export interface CoursePro {
  id: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  price: number;
  author?: string;
  creator?: string;
  numberOfPosts?: number;
  totalTime?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  sections?: any[];
  badge?: string;
  heroTitle?: string;
  titleHighlight?: string;
  subtitle?: string;
  subtitleHighlights?: {
    text: string;
    isHighlight: boolean;
  }[];
  codePreview?: {
    lines: {
      text: string;
      color: string;
      indent: number;
    }[];
  };
  stats?: {
    projects: string;
    exercises: string;
    access: string;
    support: string;
  };
  learningOutcomes?: string[];
}
