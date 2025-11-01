"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CoursePro } from "@/types/coursePro";
import Background from "@/components/ui/Background";
import { PRO_API_URL } from "@/services/api.service";
interface CoursePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

export default function CoursePaymentModal({
  isOpen,
  onClose,
  courseId,
}: CoursePaymentModalProps) {
  const [course, setCourse] = useState<CoursePro | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      try {
        const response = await fetch(`${PRO_API_URL}/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const selectedCourse = await response.json();
        setCourse(selectedCourse);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCourse(null); // Đặt lại khóa học nếu có lỗi
      }
    };

    fetchData();
  }, [courseId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <Background>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex">
            <div className="flex-1 p-8 bg-gray-50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              >
                ×
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src={course?.image || "/images/default-course.png"}
                    alt={course?.title || "Course"}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {course?.title}
                </h2>
              </div>

              <div className="text-gray-600 mb-6 leading-relaxed">
                {course?.subtitleHighlights?.map((item, index) => (
                  <React.Fragment key={index}>
                    <span className={item.isHighlight ? "font-bold" : ""}>
                      {item.text}
                    </span>
                    {index < course?.subtitleHighlights?.length - 1 ? " " : ""}
                  </React.Fragment>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">
                  Bạn nhận được gì từ khóa học này?
                </h3>
                <ul className="space-y-2">
                  <div>
                    {course?.learningOutcomes &&
                      course.learningOutcomes.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                  </div>
                </ul>
              </div>
            </div>

            <div className="w-96 p-8 bg-white flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Chi tiết thanh toán
              </h3>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {course?.title}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>• Giá gốc</span>
                    <span className="line-through">
                      {formatPrice(course?.discountPrice || course?.price || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-semibold">
                    <span>• Giá ưu đãi hôm nay</span>
                    <span className="text-orange-600">
                      {formatPrice(course?.price || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">TỔNG</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {formatPrice(course?.price || 0)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl mb-4">
                Tiếp tục thanh toán
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Thanh toán an toàn với SePay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
