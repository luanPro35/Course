"use client";
import React, { useState } from "react";
import Image from "next/image";
import type { CoursePro } from "@/types/coursePro";
import Link from "next/link";

interface CourseProProps {
  course: CoursePro;
}

export default function CoursePro({ course }: CourseProProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    course.thumbnailUrl && 
    course.thumbnailUrl.trim() !== "" && 
    !course.thumbnailUrl.startsWith("data:image") && 
    course.thumbnailUrl !== "/default-course.jpg" 
      ? course.thumbnailUrl 
      : "/images/PostF8.png"
  );

  return (
    <Link
      href={`/courses/pro/${course.id}`}
      key={course.id}
      className="w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        <Image
          src={imgSrc}
          alt={course.title}
          width={320}
          height={180}
          className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
          onError={() => {
            setImgSrc("/images/PostF8.png");
          }}
        />

      </div>

      <div className="p-4 bg-white">
        <h3 className="font-semibold text-gray-800 mb-3">{course.title}</h3>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-orange-600">
            {course.price ? (
              new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
              }).format(course.price)
            ) : (
              'Liên hệ'
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
