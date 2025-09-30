export type CardTrending = {
  id: number;
  image: string;
  title: string;
  author: string;
  time_posts: string;
};

export const cardTrending: CardTrending[] = [
  {
    id: 1,
    image: "/images/Girls.png",
    title: "Tổng hợp các sản phẩm của học viên tại F8",
    author: "Sơn Đặng",
    time_posts: "6 phút đọc",
  },
  {
    id: 2,
    image: "/images/Webpack.png",
    title: "[Phần 1] Tạo dự án ReactJS với Webpack và Babel",
    author: "Sơn Đặng",
    time_posts: "12 phút đọc",
  },
  {
    id: 3,
    image: "/images/Github.png",
    title: "Cách đưa code lên GitHub và tạo GitHub Pages",
    author: "Vo Minh Kha",
    time_posts: "4 phút đọc",
  },
  {
    id: 4,
    image: "/images/Girl.png",
    title: "Ký sự ngày thứ 25 học ở F8",
    author: "Sơn Sơn",
    time_posts: "1 phút đọc",
  },
  {
    id: 5,
    image: "/images/TS.png",
    title: "Các nguồn tài nguyên hữu ích cho 1 front-end developer",
    author: "Dương Vương",
    time_posts: "2 phút đọc",
  },
  {
    id: 6,
    image: "/images/Calendar.png",
    title: "Thời gian và Động lực",
    author: "Dong Ngo",
    time_posts: "6 phút đọc",
  },
  {
    id: 7,
    image: "/images/LearnEnglish.png",
    title: "Tổng hợp tài liệu tự học tiếng anh cơ bản.",
    author: "Trung Lê Thành",
    time_posts: "10 phút đọc",
  },
  {
    id: 8,
    image: "/images/Laster.png",
    title: "Học như thế nào là phù hợp ?",
    author: "Ngoc Tien Pham",
    time_posts: "4 phút đọc",
  },
];
