"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CoursePro } from "@/types/coursePro";
import CourseThreadBackground from "@/components/ui/Background";
import ButtonRegister from "./ButtonRegister";
import Link from "next/link";
import CoursePaymentModal from "./CoursePaymentModal";

interface DynamicCoursePageProps {
  courseId: string;
  course: CoursePro;
}
//note
export default function DynamicCoursePage({ course }: DynamicCoursePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <CourseThreadBackground>
      <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 rounded-lg p-3">
                <Link href="/">
                  <Image
                    src="/images/Brand.png"
                    width={60}
                    height={60}
                    alt="Brand logo"
                    className="object-contain"
                  />
                </Link>
              </div>
              <div>
                <p className="text-amber-600 font-semibold text-sm uppercase tracking-wide">
                  Học Tập Không Giới Hạn
                </p>
                <p className="text-white text-sm">Online Course Platform</p>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  {course.badge}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {course.title}{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    {course.titleHighlight}
                  </span>{" "}
                  {course.subtitle}
                </h1>
                <h2 className="text-lg md:text-xl text-white leading-relaxed mb-8">
                  {course.subtitleHighlights.map((part, index) =>
                    part.isHighlight ? (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent"
                      >
                        {part.text}
                      </span>
                    ) : (
                      <span key={index}>{part.text}</span>
                    )
                  )}
                </h2>

                <div className="flex flex-wrap gap-4 pt-4">
                  <ButtonRegister onClick={handleOpenModal} />
                </div>
              </div>

              {/* Hero Image/Preview */}
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 shadow-2xl">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3 font-mono text-sm">
                      {course.codePreview.lines.map((line, index) => (
                        <div
                          key={index}
                          className={`${line.color} ${
                            line.indent === 1
                              ? "pl-4"
                              : line.indent === 2
                              ? "pl-8"
                              : ""
                          }`}
                        >
                          {line.text || "\u00A0"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-amber-600 mb-2">
                {course.stats.projects}
              </p>
              <p className="text-gray-600 font-medium">Dự án thực tế</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-amber-600 mb-2">
                {course.stats.exercises}
              </p>
              <p className="text-gray-600 font-medium">Bài tập & Thử thách</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-amber-600 mb-2">
                {course.stats.access}
              </p>
              <p className="text-gray-600 font-medium">Truy cập trọn đời</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-amber-600 mb-2">
                {course.stats.support}
              </p>
              <p className="text-gray-600 font-medium">Hỗ trợ học viên</p>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Bạn sẽ học được gì?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-white mx-auto max-w-4xl">
              {course.learningOutcomes.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CoursePaymentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          courseId={course.id}
        />
      )}
    </CourseThreadBackground>
  );
}
