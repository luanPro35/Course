"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import ProCourseForm from "../forms/ProCourseForm";
import FreeCourseForm from "../forms/FreeCourseForm";
import VideoForm from "../forms/VideoForm";

type CourseType = "free" | "pro" | "video";

export default function CreateCoursePage() {
  const router = useRouter();
  const [courseType, setCourseType] = useState<CourseType>("free");

  const handleSuccess = () => {
    router.push("/admin/courses");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-8xl mx-auto px-4 py-8">
        {}
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại danh sách</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tạo mới
              </h1>
              <p className="text-gray-500 mt-1">
                Tạo khóa học miễn phí hoặc Pro với đầy đủ nội dung
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-4">
              <button
                onClick={() => setCourseType("free")}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  courseType === "free"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🎓 Khóa học miễn phí
                {courseType === "free" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
              <button
                onClick={() => setCourseType("pro")}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  courseType === "pro"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                💎 Khóa học Pro
                {courseType === "pro" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
              <button
                onClick={() => setCourseType("video")}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  courseType === "video"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🎬 Đăng video
                {courseType === "video" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            </div>
          </div>

          {}
          <div className="p-6">
            {courseType === "free" && (
              <FreeCourseForm onSuccess={handleSuccess} />
            )}
            {courseType === "pro" && (
              <ProCourseForm onSuccess={handleSuccess} />
            )}
            {courseType === "video" && (
              <VideoForm onSuccess={handleSuccess} />
            )}
          </div>
        </div>

        {}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Mẹo:</strong> Bạn có thể thêm nhiều chương và bài học sau khi tạo khóa học
          </p>
        </div>
      </div>
    </div>
  );
}
