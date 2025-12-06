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

          <div className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {course.badge && (
                  <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {course.badge}
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {course.title}{" "}
                  {course.titleHighlight && (
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                      {course.titleHighlight}
                    </span>
                  )}{" "}
                  {course.subtitle}
                </h1>
                
                <p className="text-lg md:text-xl text-white leading-relaxed mb-6">
                  {course.description || "Khóa học chất lượng cao với nội dung được thiết kế bài bản"}
                </p>

                <div className="mb-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    {course.price && (
                      <span className="text-3xl md:text-4xl font-bold text-amber-400">
                        {course.price.toLocaleString('vi-VN')} VNĐ
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <ButtonRegister onClick={handleOpenModal} />
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 shadow-2xl">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <Image
                      src={course.thumbnailUrl && course.thumbnailUrl.trim() !== "" && !course.thumbnailUrl.startsWith("data:image") && course.thumbnailUrl !== "/default-course.jpg" ? course.thumbnailUrl : "/images/PostF8.png"}
                      alt={course.title}
                      width={500}
                      height={300}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
                <span className="text-4xl font-bold text-orange-500 mb-2">10+</span>
                <span className="text-gray-600 font-medium">Số lượng dự án</span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
                <span className="text-4xl font-bold text-orange-500 mb-2">50+</span>
                <span className="text-gray-600 font-medium">Số lượng bài tập</span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
                <span className="text-4xl font-bold text-orange-500 mb-2">∞</span>
                <span className="text-gray-600 font-medium">Truy cập trọn đời</span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
                <span className="text-4xl font-bold text-orange-500 mb-2">24/7</span>
                <span className="text-gray-600 font-medium">Hỗ trợ học viên</span>
              </div>
            </div>
          </div>

          {(() => {
            let outcomes: string[] = [];
            
            if (course.learningOutcomes) {
              try {
                if (Array.isArray(course.learningOutcomes)) {
                  outcomes = course.learningOutcomes;
                } else if (typeof course.learningOutcomes === 'string') {
                  outcomes = JSON.parse(course.learningOutcomes);
                }
              } catch (e) {
                console.error('Failed to parse learningOutcomes:', e);
              }
            }
            if (outcomes.length === 0) return null;
            
            return (
              <div className="mb-20">
                <h3 className="text-3xl font-bold text-white mb-8 text-center">
                  Bạn sẽ học được gì?
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mx-auto max-w-4xl">
                  <div className="grid md:grid-cols-2 gap-6 text-white">
                    {outcomes.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <p className="text-white leading-relaxed">{item.trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
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
