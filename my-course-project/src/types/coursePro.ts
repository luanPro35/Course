export interface Course {
  id: string;
  image: string;
  title: string;
  price: number;
  discountPrice?: number;
  author: string;
  numberOfPosts: number;
  totalTime: string;
}

export const courses: Course[] = [
  {
    id: "1",
    image: "/images/HTML-CSS.png",
    title: "HTML, CSS Pro",
    price: 1299000,
    discountPrice: 2500000,
    author: "Sơn Đặng",
    numberOfPosts: 590,
    totalTime: "116h50p",
  },

  {
    id: "2",
    image: "/images/JSPro.png",
    title: "Javascript Pro",
    price: 1399000,
    discountPrice: 3299000,
    author: "Sơn Đặng",
    numberOfPosts: 254,
    totalTime: "49h34p",
  },

  {
    id: "3",
    image: "/images/Sass.png",
    title: "Ngôn ngữ Sass",
    price: 299000,
    discountPrice: 400000,
    author: "Sơn Đặng",
    numberOfPosts: 27,
    totalTime: "6h18p",
  },
];
