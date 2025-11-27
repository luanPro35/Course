"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import ProCourseForm from "./forms/ProCourseForm";
import FreeCourseForm from "./forms/FreeCourseForm";
import VideoForm from "./forms/VideoForm";
import { AdminCourse } from "@/types/admin.types";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editCourse?: AdminCourse | null;
}

type CourseType = "free" | "pro" | "video";

export default function CourseModal({
  isOpen,
  onClose,
  onSuccess,
  editCourse,
}: CourseModalProps) {
  const [courseType, setCourseType] = useState<CourseType>("free");

  const [loading, setLoading] = useState(false);
  const [fullCourse, setFullCourse] = useState<AdminCourse | null>(null);

  useEffect(() => {
    const fetchFullCourse = async () => {
      if (editCourse) {
        try {
          setLoading(true);
          
          const { getCourseById } = await import("@/services/adminCourse.service");
          const data = await getCourseById(Number(editCourse.id));
          setFullCourse(data);
          setCourseType(editCourse.price > 0 ? "pro" : "free");
        } catch (error) {
          console.error("Failed to fetch full course details:", error);
          
          setFullCourse(editCourse);
          setCourseType(editCourse.price > 0 ? "pro" : "free");
        } finally {
          setLoading(false);
        }
      } else {
        setFullCourse(null);
        setCourseType("free");
      }
    };

    fetchFullCourse();
  }, [editCourse]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editCourse ? "Chỉnh sửa khóa học" : "Tạo mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {}
        {!editCourse && (
          <div className="sticky top-[73px] bg-white border-b border-gray-200 px-6">
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
        )}

        {}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {courseType === "free" && (
            <FreeCourseForm
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              editCourse={fullCourse || editCourse}
            />
          )}
          {courseType === "pro" && (
            <ProCourseForm
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              editCourse={fullCourse || editCourse}
            />
          )}
          {courseType === "video" && (
            <VideoForm
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
