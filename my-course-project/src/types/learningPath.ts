export interface route {
  id: number;
  title: string;
  image: string;
  content: string;
  url: string;
}

export const learningRoutes: route[] = [
  {
    id: 1,
    title: "Lộ trình học Front-end",
    content:
      "Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.",
    image: "/images/Route.png",
    url: "/courses/front-end",
  },
  {
    id: 2,
    title: "Lộ trình học Back-end",
    content:
      "Trái với Front-end thì Back-end là phần code chạy trên máy chủ, đây là phần xử lý các nghiệp vụ logic của website. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Back-end nhé.",
    image: "/images/Route.png",
    url: "/courses/back-end",
  },
];
