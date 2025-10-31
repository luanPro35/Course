export interface Post {
  id: string;
  title: string;
  content: string;
  fullContent?: string;
  author: string;
  category: string;
  image: string;
  createdAt: string;
  timeAgo: string;
  readTime: string;
}

export interface LinkPost {
  link: string;
  categories: string[];
}
