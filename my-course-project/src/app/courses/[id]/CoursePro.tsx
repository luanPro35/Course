"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { CoursePro } from "@/types/coursePro";
import Loading from "@/components/ui/Loading";
import { getCourses } from "@/services/coursesPro";

export default function CoursePro() {
  const [courses, setCourses] = useState<CoursePro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {courses.map((course) => (
        <div
          key={course.id}
          className="w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 relative">
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

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span className="text-orange-600 font-bold text-lg">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(course.price)}
              </span>{" "}
              <span className="text-gray-400 line-through">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(course.discountPrice ?? 0)}
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
    </>
  );
}
