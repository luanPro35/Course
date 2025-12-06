"use client";

import { CourseFree, Lesson } from "@/types/courseFree";
import React, { useState } from "react";
import Image from "next/image";
import CourseImageDisplay from "./CourseImageDisplay";
import Loading from "@/components/ui/Loading";
import FreeCourseBtn from "./FreeCourseBtn";
export interface CourseDetailClientProps {
  course: CourseFree;
}

export function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-500">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-6 grid grid-cols-1 md:grid-cols-10 gap-6">
      <div className="md:col-span-4">
        {course.thumbnailUrl ? (
          <CourseImageDisplay src={course.thumbnailUrl} alt={course.title} />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
        <h1 className="text-4xl font-bold text-orange-600 mb-8 mt-8 text-center">
          Miễn phí
        </h1>
        <div className="flex justify-center">
          <FreeCourseBtn course={course} />
        </div>
      </div>

      <div className="md:col-span-6">
        <div className="text-4xl font-bold pb-5 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          {course.titleSection}
        </div>
        <div className="text-gray-800 leading-relaxed text-sm mb-8">
          {course.contentSection}
        </div>
        <div className="text-2xl font-semibold mb-3">Nội dung khóa học</div>
        {course.sections && course.sections.length > 0 && (
          <div className="mt-6 space-y-4">
            {course.sections.map((section, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection(index)}
                  className="bg-gray-100 px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <h2 className="font-semibold text-gray-800">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {section.totalLesson} bài học
                    </span>
                    <span
                      className={`text-gray-600 opacity-75 transition-transform duration-200 ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                <div
                  className={`bg-white px-4 py-2 overflow-hidden transition-all duration-700 ease-in-out ${
                    openSections[index] ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  {section.lessons &&
                    section.lessons.map((lesson: Lesson) => (
                      <div
                        key={lesson.id}
                        className="flex justify-between items-center py-2 border-b last:border-none border-gray-100"
                      >
                        <span>{lesson.title}</span>
                        {lesson.contentUrl ? (
                          <a
                            href={lesson.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm font-medium hover:text-blue-800 transition-colors"
                            onClick={(e) => {
                              if (!lesson.contentUrl || lesson.contentUrl.trim() === "") {
                                e.preventDefault();
                                alert("URL video chưa được cập nhật");
                              }
                            }}
                          >
                            ▶ Xem
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Chưa có video
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
