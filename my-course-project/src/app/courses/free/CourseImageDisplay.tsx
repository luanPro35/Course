"use client";

import React from "react";
import Image from "next/image";

interface CourseImageDisplayProps {
  src: string;
  alt: string;
}

const CourseImageDisplay: React.FC<CourseImageDisplayProps> = React.memo(
  ({ src, alt }) => {
    return (
      <div className="relative rounded-xl overflow-hidden mb-5 group shadow-2xl h-[400px]">
        <div className="relative h-full">
          <Image
            src={src}
            alt={alt}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            width={800}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-white/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:from-white group-hover:to-white/90 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CourseImageDisplay.displayName = "CourseImageDisplay";

export default CourseImageDisplay;
