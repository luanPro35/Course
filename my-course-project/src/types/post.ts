export interface Post {
  id: string; // Changed to string based on db.json
  author: string;
  title: string;
  content: string;
  category: string;
  image: string;
  status?: string; // Added based on db.json
  createdAt?: string; // Added based on db.json
  timeAgo?: string; // Made optional as it's not always present in 'posts'
  readTime?: string; // Made optional as it's not always present in 'posts'
}

export interface LinkPosts {
  id: number;
  link: string;
  title: string;
  categories: string[];
}

export interface PostDetail extends Post {
  fullContent: string;
  author: string;
  title: string;
  content: string;
  image: string;
}

export const linkPosts: LinkPosts[] = [
  {
    id: 1,
    link: "/article/FE-MobileApp",
    title: "Front-end / Mobile apps",
    categories: [
      "React Native",
      "ReactJS",
      "Front-end",
      "Javascript",
      "hoc-lap-trinh",
    ],
  },
  {
    id: 2,
    link: "/article/BE-DevOps",
    title: "Backend / DevOps",
    categories: ["DevOps", "C++", "OOP"],
  },
  {
    id: 3,
    link: "/article/UI-UX-Design",
    title: "UI / UX / Design",
    categories: ["UI", "UX", "Design"],
  },
  {
    id: 4,
    link: "/article/Other",
    title: "Other",
    categories: ["Ubuntu", ""], // "" để bắt các bài viết không có category
  },
];
