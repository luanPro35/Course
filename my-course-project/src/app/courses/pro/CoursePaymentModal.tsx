"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CoursePro } from "@/types/coursePro";
import Background from "@/components/ui/Background";
import { getCourseByIdURL } from "@/services/api.service";
import { createPayment } from "@/services/payment.service";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      try {
        const response = await fetch(getCourseByIdURL(courseId));
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const result = await response.json();
        setCourse(result?.data || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCourse(null);
      }
    };

    fetchData();
  }, [courseId]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setError("Vui lòng đăng nhập để tiếp tục");
        setIsProcessing(false);
        return;
      }

      const paymentData = await createPayment(courseId, token);
      
      console.log("Payment response:", paymentData);
      console.log("Payment URL:", paymentData.paymentUrl);
      
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Có lỗi xảy ra khi tạo thanh toán");
      setIsProcessing(false);
    }
  };

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
                    src={course?.thumbnailUrl && course.thumbnailUrl.trim() !== "" && !course.thumbnailUrl.startsWith("data:image") && course.thumbnailUrl !== "/default-course.jpg" ? course.thumbnailUrl : "/images/PostF8.png"}
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
                    {index < course!.subtitleHighlights!.length - 1 ? " " : ""}
                  </React.Fragment>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">
                  Bạn nhận được gì từ khóa học này?
                </h3>
                <ul className="space-y-2">
                  <div>
                    {(() => {
                      let outcomes: string[] = [];
                      
                      if (course?.learningOutcomes) {
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
                      
                      return outcomes.map((item: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <span className="text-gray-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ));
                    })()}
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
                  <div className="flex justify-between text-gray-900 font-semibold">
                    <span>• Giá khóa học</span>
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

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl mb-4"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Tiếp tục thanh toán"
                )}
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
