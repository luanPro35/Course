import { NextResponse } from "next/server";

export async function GET() {
  const courseFree = [
    {
      id: "1",
      image: "/images/Introductory.png",
      title: "Kiến Thức Nhập Môn IT",
      free: "Miễn phí",
      people: 136848,
      numberOfPosts: 9,
      totalTime: "3h12p",
    },
    {
      id: "2",
      image: "/images/Cpp.png",
      title: "Lập trình C++ cơ bản, nâng cao",
      free: "Miễn phí",
      people: 37107,
      numberOfPosts: 55,
      totalTime: "10h18p",
    },
    {
      id: "3",
      image: "/images/HTML-CSS_Basic.png",
      title: "HTML CSS từ Zero đến Hero",
      free: "Miễn phí",
      people: 214957,
      numberOfPosts: 117,
      totalTime: "29h5p",
    },
    {
      id: "4",
      image: "/images/Responsive.png",
      title: "Responsive Với Grid System",
      free: "Miễn phí",
      people: 47905,
      numberOfPosts: 34,
      totalTime: "6h31p",
    },
    {
      id: "5",
      image: "/images/JSBasic.png",
      title: "Lập Trình JavaScript Cơ Bản",
      free: "Miễn phí",
      people: 151347,
      numberOfPosts: 112,
      totalTime: "24h15p",
    },
    {
      id: "6",
      image: "/images/JSAdvanced.png",
      title: "Lập Trình JavaScript Nâng Cao",
      free: "Miễn phí",
      people: 41600,
      numberOfPosts: 19,
      totalTime: "8h41p",
    },
    {
      id: "7",
      image: "/images/Ubuntu.png",
      title: "Làm việc với Terminal & Ubuntu",
      free: "Miễn phí",
      people: 21296,
      numberOfPosts: 28,
      totalTime: "4h59p",
    },
    {
      id: "8",
      image: "/images/ReactJS.png",
      title: "Xây Dựng Website với ReactJS",
      free: "Miễn phí",
      people: 78375,
      numberOfPosts: 112,
      totalTime: "27h32p",
    },
  ];
  return NextResponse.json(courseFree);
}
