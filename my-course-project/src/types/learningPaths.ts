export interface PathConfig {
  title: string;
  image: string;
  courseTitles: string[];
}

export const pathConfig: Record<"frontend" | "backend", PathConfig> = {
  frontend: {
    title: "Lộ trình học Front-end",
    image: "/images/frontend.png",
    courseTitles: [
      "Kiến Thức Nhập Môn IT",
      "HTML, CSS Pro",
      "Responsive Với Grid System",
      "Lập Trình JavaScript Cơ Bản",
      "Lập Trình JavaScript Nâng Cao",
      "Làm việc với Terminal & Ubuntu",
      "Xây Dựng Website với ReactJS",
    ],
  },
  backend: {
    title: "Lộ trình học Back-end",
    image: "/images/back-end.png",
    courseTitles: [
      "Kiến Thức Nhập Môn IT",
      "Lập Trình JavaScript Cơ Bản",
      "Lập Trình JavaScript Nâng Cao",
      "Làm việc với Terminal & Ubuntu",
      "Node & ExpressJS",
    ],
  },
};
