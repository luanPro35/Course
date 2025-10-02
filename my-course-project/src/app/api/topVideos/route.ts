import { NextResponse } from "next/server";

export async function GET() {
  const topVideo = [
    {
      id: "1",
      image: "/images/video-1.png",
      time: "03:15",
      title: "Bạn sẽ làm được gì sau khóa học?",
      numberOfEyes: 1112900,
      numberOfLike: 6542,
      numberOfComment: 161,
      url: "https://www.youtube.com/watch?v=R6plN3FvzFY&feature=youtu.be",
    },
    {
      id: "2",
      image: "/images/video-2.png",
      time: "34:51",
      title: "Sinh viên IT di thực tập tại doanh nghiệp cần biết những gì?",
      numberOfEyes: 263338,
      numberOfLike: 6428,
      numberOfComment: 236,
      url: "https://www.youtube.com/watch?v=YH-E4Y3EaT4&feature=youtu.be",
    },
    {
      id: "3",
      image: "/images/video-3.png",
      time: "24:06",
      title: "Phương pháp học lập trình của Admin F8?",
      numberOfEyes: 131508,
      numberOfLike: 6211,
      numberOfComment: 340,
      url: "https://www.youtube.com/watch?v=DpvYHLUiZpc",
    },
    {
      id: "4",
      image: "/images/video-4.png",
      time: "25:10",
      title: '"Code Thiếu Nhi Battle" Tranh Giành Trà Sữa Size L',
      numberOfEyes: 282369,
      numberOfLike: 5686,
      numberOfComment: 182,
      url: "https://www.youtube.com/watch?v=sgq7BH6WxL8",
    },
    {
      id: "5",
      image: "/images/video-5.png",
      time: "07:53",
      title:
        "Javascript có thể làm được gì? Giới thiệu qua về trang F8 | Học lập trình...",
      numberOfEyes: 862140,
      numberOfLike: 4567,
      numberOfComment: 132,
      url: "https://www.youtube.com/watch?v=0SJE9dYdpps",
    },
    {
      id: "6",
      image: "/images/video-6.png",
      time: "10:41",
      title: "ReactJS là gì? Tại sao nên học ReactJS?",
      numberOfEyes: 513229,
      numberOfLike: 3898,
      numberOfComment: 352,
      url: "https://www.youtube.com/watch?v=x0fSBAgBrOQ&feature=youtu.be",
    },
    {
      id: "7",
      image: "/images/video-7.png",
      time: "35:04",
      title: "Các thẻ HTML thông dụng",
      numberOfEyes: 365386,
      numberOfLike: 3762,
      numberOfComment: 211,
      url: "https://www.youtube.com/watch?v=AzmdwZ6e_aM&feature=youtu.be",
    },
    {
      id: "8",
      image: "/images/video-8.png",
      time: "35:04",
      title: "Học Flexbox qua ví dụ",
      numberOfEyes: 257286,
      numberOfLike: 3478,
      numberOfComment: 216,
      url: "https://www.youtube.com/watch?v=G19jZzK5FWI",
    },
  ];

  return NextResponse.json(topVideo);
}
