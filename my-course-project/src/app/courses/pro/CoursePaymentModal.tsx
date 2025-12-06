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
    } catch (err) {
      console.error("Payment error:", err);

      let errorMessage = "Đã xảy ra lỗi khi thanh toán";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }

      setError(errorMessage);
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center transition-all group-hover:rotate-90 duration-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </button>

          <div className="flex flex-col md:flex-row overflow-y-auto max-h-[90vh]">
            <div className="flex-1 p-8 md:p-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
              <div className="flex items-start gap-5 mb-8">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white flex-shrink-0">
                  <Image
                    src={
                      course?.thumbnailUrl &&
                      course.thumbnailUrl.trim() !== "" &&
                      !course.thumbnailUrl.startsWith("data:image") &&
                      course.thumbnailUrl !== "/default-course.jpg"
                        ? course.thumbnailUrl
                        : "/images/PostF8.png"
                    }
                    alt={course?.title || "Course"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-3">
                    KHÓA HỌC PRO
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                    {course?.title}
                  </h2>
                </div>
              </div>

              <div className="text-gray-700 mb-8 text-lg leading-relaxed bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                {course?.subtitleHighlights?.map((item, index) => (
                  <React.Fragment key={index}>
                    <span
                      className={
                        item.isHighlight ? "font-bold text-blue-600" : ""
                      }
                    >
                      {item.text}
                    </span>
                    {index < course!.subtitleHighlights!.length - 1 ? " " : ""}
                  </React.Fragment>
                ))}
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl">
                    Bạn sẽ học được gì?
                  </h3>
                </div>
                <ul className="space-y-3">
                  <div>
                    {(() => {
                      let outcomes: string[] = [];

                      if (course?.learningOutcomes) {
                        try {
                          if (Array.isArray(course.learningOutcomes)) {
                            outcomes = course.learningOutcomes;
                          } else if (
                            typeof course.learningOutcomes === "string"
                          ) {
                            outcomes = JSON.parse(course.learningOutcomes);
                          }
                        } catch (e) {
                          console.error("Failed to parse learningOutcomes:", e);
                        }
                      }

                      return outcomes.map((item: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-gray-700 group hover:text-blue-600 transition-colors"
                        >
                          <span className="text-blue-500 mt-1 text-xl group-hover:scale-125 transition-transform">
                            ✓
                          </span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ));
                    })()}
                  </div>
                </ul>
              </div>
            </div>

            <div className="w-full md:w-[420px] p-8 md:p-10 bg-white flex flex-col border-l border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Thanh toán</h3>
              </div>

              <div className="mb-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  {course?.title}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Giá khóa học
                    </span>
                    <span className="text-xl font-bold text-orange-600">
                      {formatPrice(course?.price || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    TỔNG CỘNG
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {formatPrice(course?.price || 0)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-red-700 text-sm font-medium">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 disabled:transform-none mb-4"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Tiếp tục thanh toán
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Thanh toán an toàn & bảo mật</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
