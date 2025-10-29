"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Course } from "@/types/course";
import { pathConfig } from "@/types/learningPaths";

interface LearningPathPageProps {
  pathType: "frontend" | "backend";
}

export default function LearningPathPage({ pathType }: LearningPathPageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = pathConfig[pathType];

  useEffect(() => {
    async function getCourses() {
      try {
        const [resFree, resPro] = await Promise.all([
          fetch("http://localhost:3001/coursesFree"),
          fetch("http://localhost:3001/coursesPro"),
        ]);

        if (!resFree.ok || !resPro.ok) {
          throw new Error("Failed to fetch data");
        }

        const [coursesFree, coursesPro] = await Promise.all([
          resFree.json(),
          resPro.json(),
        ]);

        const allCourses = [...coursesFree, ...coursesPro];

        const filteredCourses = allCourses.filter((course: { title: string }) =>
          config.courseTitles.includes(course.title)
        );

        setCourses(filteredCourses);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    getCourses();
  }, [pathType, config.courseTitles]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
        {config.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image Section - 60% */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="h-[600px] overflow-y-auto border border-gray-200 rounded-lg">
              <Image
                src={config.image}
                alt={config.title}
                width={1000}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Courses Section - 40% */}
        <div className="lg:col-span-2">
          <div className="h-[600px] overflow-y-auto pr-2">
            <div className="space-y-4">
              {courses.map((course: Course, index: number) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-400 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={110}
                        height={110}
                        className="rounded-lg object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="font-bold text-gray-800 text-base leading-tight mb-2">
                        {course.title}
                      </h3>

                      <div className="mb-2">
                        {course.price ? (
                          <div>
                            <div className="text-red-600 font-bold text-lg">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(course.price ?? 0)}
                            </div>
                            <div className="text-gray-400 line-through text-sm">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(course.discountPrice ?? 0)}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-block bg-green-100 text-green-700 font-bold text-sm px-3 py-1 rounded-full">
                            {course.free ? "Miễn phí" : "Trả phí"}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/courses/${course.free ? "free" : "pro"}/${
                          course.id
                        }`}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-1 group"
                      >
                        Xem khóa học
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
