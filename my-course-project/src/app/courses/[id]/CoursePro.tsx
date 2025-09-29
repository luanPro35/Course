import React from "react";
import Image from "next/image";
import { Course } from "../../../types/coursePro";

interface CourseCarProps {
  course: Course;
}

export default function CoursePro({ course }: CourseCarProps) {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <div className="absolute top-3 left-3 z-10">
          <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
            <span className="text-yellow-800 text-sm font-bold">👑</span>
          </div>
        </div>

        <Image
          src={course.image}
          alt={course.title}
          width={320}
          height={180}
          className="w-full h-40 object-cover"
        />
      </div>

      <div className="p-4 bg-white">
        <h3 className="font-semibold text-gray-800 mb-3">{course.title}</h3>

        <div className="flex items-center gap-2 mb-4">
          {course.discountPrice && (
            <span className="text-gray-500 line-through text-sm">
              {course.discountPrice.toLocaleString()}đ
            </span>
          )}
          <span className="text-red-500 font-bold text-lg">
            {course.price.toLocaleString()}đ
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
            <span>{course.author}</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">▶</span>
            </div>
            <span>{course.numberOfPosts}</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🕐</span>
            </div>
            <span>{course.totalTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
