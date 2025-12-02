"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { CourseFree } from "@/types/courseFree";
import { courseService } from "@/services/course.service";
import { useAuth } from "@/hooks/useAuth";

export default function UserCoursesPage() {
  const { user } = useAuth();
  const [registeredCourses, setRegisteredCourses] = useState<CourseFree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!user?.id) {
        setError("Bạn cần đăng nhập để xem khóa học.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const courses = await courseService.getMyCourses();
        setRegisteredCourses(courses);
      } catch (err) {
        console.error("Failed to fetch user courses:", err);
        setError("Không thể tải danh sách khóa học.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, [user?.id]);

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (registeredCourses.length === 0)
    return (
      <div className="text-center text-gray-600 py-10">
        Bạn chưa đăng ký khóa học nào.
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Khóa học của tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registeredCourses.map((course, index) => (
          <div
            key={`${course.id}-${index}`}
            className="w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                width={320}
                height={180}
                className="w-full h-40 object-cover"
              />
            </div>

            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-800 mb-3">
                {course.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span className="text-orange-600 font-bold text-lg">
                  {course.free}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
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
        ))}
      </div>
    </div>
  );
}
