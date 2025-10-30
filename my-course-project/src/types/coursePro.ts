export interface CoursePro {
  id: string;
  image: string;
  title: string;
  price: number;
  discountPrice?: number;
  author: string;
  numberOfPosts: number;
  totalTime: string;
  badge: string;
  heroTitle: string;
  titleHighlight: string;
  subtitle: string;
  subtitleHighlights: {
    text: string;
    isHighlight: boolean;
  }[];
  codePreview: {
    lines: {
      text: string;
      color: string;
      indent: number;
    }[];
  };
  stats: {
    projects: string;
    exercises: string;
    access: string;
    support: string;
  };
  learningOutcomes: string[];
}
