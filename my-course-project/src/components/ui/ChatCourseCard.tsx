"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  slug?: string;
}

const ChatCourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  price,
  image,
  slug,
}) => {
  const [imgSrc, setImgSrc] = useState(image || "/images/course-placeholder.jpg");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-row hover:shadow-md transition-shadow duration-200">
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={imgSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300"
          onError={() => setImgSrc("https://placehold.co/600x400?text=Course")}
        />
      </div>

      <div className="p-3 flex flex-col justify-between flex-grow min-w-0">
        <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">
          {title}
        </h4>
        
        <div className="flex items-center justify-between mt-2">
             <div className="text-gray-900 text-sm font-bold">
              {price === 0 ? "Miễn phí" : formatPrice(price)}
            </div>
            <Link
              href={`/courses/pro/${id}`}
              className="text-xs bg-gray-100 text-gray-900 hover:bg-gray-200 px-3 py-1.5 rounded-full font-medium transition-colors"
            >
              Xem ngay
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatCourseCard;
