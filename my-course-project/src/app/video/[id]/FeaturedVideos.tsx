import { TopVideo } from "@/types/topVideo";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Eye, ThumbsUp, MessageCircle } from "lucide-react";
import Loading from "@/components/ui/Loading";
import { getTopVideos } from "@/services/topVideo";

export default function FeaturedVideos() {
  const [videoTop, setVideoTop] = useState<TopVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopVideos()
      .then(setVideoTop)
      .catch((error) => console.error("Error fetching courses:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

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
      {videoTop.map((video) => (
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
