import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CourseFree } from "@/types/courseFree";

interface MyCoursesDropdownProps {
  courses: CourseFree[];
}

export default function MyCoursesDropdown({ courses }: MyCoursesDropdownProps) {
  return (
    <div className="w-90 bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Khóa học của tôi
        </h3>
        <Link
          href="/user/courses"
          className="text-orange-600 text-sm hover:underline"
        >
          Xem tất cả
        </Link>
      </div>
      {courses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Bạn chưa đăng ký khóa học nào.
        </p>
      ) : (
        <div className="space-y-2">
          {courses.map((course, index) => (
            <div
              key={`${course.id}-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={course.thumbnailUrl || "/images/Introductory.png"}
                  alt={course.title || "Course Image"}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">{course.title}</p>
                <p className="text-sm text-gray-500">
                  {course.isCompleted ? "Đã hoàn thành" : "Đang học"}
                </p>
                <Link
                  href={`/courses/free/${course.id}`}
                  className="text-orange-600 text-sm font-semibold hover:underline"
                >
                  {course.isCompleted ? "Xem lại" : "Tiếp tục học"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
