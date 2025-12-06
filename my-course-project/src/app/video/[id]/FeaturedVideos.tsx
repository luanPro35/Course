import React from "react";
import Image from "next/image";
import { Play, Eye, ThumbsUp, MessageCircle } from "lucide-react";

const featuredVideos = [
  {
    id: 1,
    title: "Học ReactJS cùng F8",
    url: "https://www.youtube.com/playlist?list=PLwJIrGynFq9DIHRpFOEbVJPwKEbxmLjbf",
    image: "https://files.fullstack.edu.vn/f8-prod/courses/13/13.png",
    time: "10:30",
    numberOfEyes: 15000,
    numberOfLike: 1200,
    numberOfComment: 350,
  },
  {
    id: 2,
    title: "Học NodeJS cùng F8",
    url: "https://www.youtube.com/playlist?list=PLwJIrGynFq9BZto5VvKw7OEDNxN6plq_3",
    image: "https://trungquandev.com/wp-content/uploads/2018/04/tong-quan-nodejs-trungquandev-02.jpg",
    time: "15:45",
    numberOfEyes: 23000,
    numberOfLike: 2100,
    numberOfComment: 580,
  },
  {
    id: 3,
    title: "Kiến Thức Nhập Môn",
    url: "https://www.youtube.com/playlist?list=PL_-VfJajZj0WSVCw3lKo2lYifzXekkv6M",
    image: "https://topdev.vn/blog/wp-content/uploads/2023/05/nhap-mon-lap-trinh-9-canh-gioi-ma-ban-co-the-dat-toi.png",
    time: "08:20",
    numberOfEyes: 18500,
    numberOfLike: 1650,
    numberOfComment: 420,
  },
  {
    id: 4,
    title: "Học HTML, CSS trước khi học ReactJS",
    url: "https://fullstack.edu.vn/courses/html-css?utm_source=chatgpt.com",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
    time: "12:15",
    numberOfEyes: 31000,
    numberOfLike: 2800,
    numberOfComment: 720,
  },
];

export default function FeaturedVideos() {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      {featuredVideos.map((video) => (
        <a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <div className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <div className="relative w-full h-52 overflow-hidden bg-gray-900">
              <Image
                src={video.image}
                alt={video.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority={false}
              />

              <div className="absolute bottom-3 left-3 flex items-center justify-center bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  <Play
                    className="w-5 h-5 text-gray-900 ml-0.5"
                    fill="currentColor"
                  />
                </div>
              </div>

              <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white text-sm font-semibold px-2 py-1 rounded">
                {video.time}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-base mb-3 line-clamp-2 min-h-[3rem] leading-relaxed">
                {video.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(video.numberOfEyes)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{formatNumber(video.numberOfLike)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span>{formatNumber(video.numberOfComment)}</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </>
  );
}
