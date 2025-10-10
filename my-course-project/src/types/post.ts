export interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  category: string;
  image: string;
}

export interface LinkPosts {
  id: number;
  link: string;
  title: string;
}

export const linkPosts: LinkPosts[] = [
  {
    id: 1,
    link: "/article/1",
    title: "Front-end / Mobile apps",
  },
  {
    id: 2,
    link: "/article/2",
    title: "Backend / DevOps",
  },
  {
    id: 3,
    link: "/article/1",
    title: "UI / UX / Design",
  },
  {
    id: 4,
    link: "/article/1",
    title: "Other",
  },
];
