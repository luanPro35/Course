"use client";

import React, { useState, useEffect } from "react";
import { createCourse, updateCourse, updateCourseStatus } from "@/services/adminCourse.service";
import {
  AdminCourse,
  CourseStatus,
  CreateCourseDTO,
  Section,
  Lesson,
} from "@/types/admin.types";
import Toast, { ToastType } from "@/components/Toast";
import ImageUpload from "@/components/ImageUpload";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface FreeCourseFormProps {
  onSuccess: () => void;
  editCourse?: AdminCourse | null;
}

export default function FreeCourseForm({
  onSuccess,
  editCourse,
}: FreeCourseFormProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
  });

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (editCourse) {
      setFormData({
        title: editCourse.title || "",
        description: editCourse.description || "",
        thumbnailUrl: editCourse.thumbnailUrl || "",
      });
      setSections(editCourse.sections || []);
    }
  }, [editCourse]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        orderIndex: sections.length,
        lessons: [],
      },
    ]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const addLesson = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons.push({
      title: "",
      contentUrl: "",
      orderIndex: newSections[sectionIndex].lessons.length,
      durationInMinutes: 0,
    });
    setSections(newSections);
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons = newSections[
      sectionIndex
    ].lessons.filter((_, i) => i !== lessonIndex);
    setSections(newSections);
  };

  const updateLesson = (
    sectionIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string | number
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons[lessonIndex] = {
      ...newSections[sectionIndex].lessons[lessonIndex],
      [field]: value,
    };
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent, status: "DRAFT" | "PUBLISHED" = "DRAFT") => {
    e.preventDefault();

    
    if (!formData.title || !formData.description) {
      setToast({
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const courseData: CreateCourseDTO = {
        title: formData.title,
        description: formData.description,
        price: 0, 
        thumbnailUrl: formData.thumbnailUrl || "/images/PostF8.png",
        sections: sections,
      };

      if (editCourse) {
        await updateCourse(Number(editCourse.id), courseData);
        setToast({ message: "Cập nhật khóa học thành công!", type: "success" });
      } else {
        const createdCourse = await createCourse(courseData);
        
        if (status === "PUBLISHED" && createdCourse?.id) {
          await updateCourseStatus(Number(createdCourse.id), CourseStatus.PUBLISHED);
        }
        setToast({
          message: status === "PUBLISHED" 
            ? "Tạo và công khai khóa học miễn phí thành công!" 
            : "Lưu khóa học miễn phí dưới dạng nháp thành công!",
          type: "success",
        });
      }

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error) {
      console.error("Error saving course:", error);
      setToast({
        message: error instanceof Error ? error.message : "Có lỗi xảy ra",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Thông tin khóa học miễn phí
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên khóa học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: HTML CSS Căn bản"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả tổng quan về khóa học, nội dung chính, đối tượng học viên..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              📝 Mô tả chung về khóa học
            </p>
          </div>

          <ImageUpload
            value={formData.thumbnailUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, thumbnailUrl: url }))}
            label="Hình ảnh khóa học"
          />
        </div>

        {}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Nội dung khóa học
            </h3>
            <button
              type="button"
              onClick={addSection}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm chương
            </button>
          </div>

          {sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="border border-gray-300 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">
                  Chương {sectionIndex + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeSection(sectionIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                value={section.title}
                onChange={(e) =>
                  updateSection(sectionIndex, "title", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tên chương"
              />

              {}
              <div className="ml-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-700">
                    Bài học
                  </h5>
                  <button
                    type="button"
                    onClick={() => addLesson(sectionIndex)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm bài
                  </button>
                </div>

                {section.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="border border-gray-200 rounded p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Bài {lessonIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLesson(sectionIndex, lessonIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) =>
                        updateLesson(
                          sectionIndex,
                          lessonIndex,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tên bài học"
                    />

                    <input
                      type="text"
                      value={lesson.contentUrl}
                      onChange={(e) =>
                        updateLesson(
                          sectionIndex,
                          lessonIndex,
                          "contentUrl",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="URL video/nội dung"
                    />

                    <input
                      type="number"
                      value={lesson.durationInMinutes || ""}
                      onChange={(e) =>
                        updateLesson(
                          sectionIndex,
                          lessonIndex,
                          "durationInMinutes",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Thời lượng (phút)"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Lưu ý:</strong> Khóa học miễn phí sẽ có giá = 0 VNĐ và
            được hiển thị trong danh sách khóa học FREE khi trạng thái là Công
            khai.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e as any, "DRAFT")}
            disabled={loading}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading
              ? "Đang xử lý..."
              : editCourse
              ? "Cập nhật khóa học"
              : "💾 Lưu nháp"}
          </button>
          
          <button
            type="submit"
            onClick={(e) => handleSubmit(e as any, "PUBLISHED")}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading
              ? "Đang xử lý..."
              : editCourse
              ? "Cập nhật khóa học"
              : "🚀 Công khai ngay"}
          </button>
        </div>
      </form>
    </div>
  );
}
