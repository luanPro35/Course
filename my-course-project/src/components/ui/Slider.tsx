"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface CourseSection {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  backgroundColors: string;
  image?: string;
  price?: {
    original: string;
    current: string;
    note?: string;
  };
}

const CourseLandingSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const courses: CourseSection[] = [
    {
      id: "LearnX youtube",
      title: "LearnX on Youtube",
      description:
        "LearnX được nhắc tới ở mọi nơi, ở đâu có có hỏi việc làm cho nghề IT và có những con người yêu thích lập trình LearnX sẽ ở đó.",
      buttonText: "ĐĂNG KÝ KÊNH",
      image: "Page.png",
      backgroundColors: "from-pink-500 to-orange-500",
    },
    {
      id: "student-achievements",
      title: "Thành Quả của Học Viên",
      description:
        "Để đạt được kết quả tốt trong mọi việc ta cần xác định mục tiêu rõ ràng cho việc đó. Học lập trình cũng không là ngoại lệ.",
      buttonText: "XEM THÀNH QUẢ",
      image: "Project.png",
      backgroundColors: "from-purple-600 to-blue-500",
    },
    {
      id: "reactjs-free",
      title: "Học ReactJS Miễn Phí!",
      description:
        "Khóa học ReactJS từ cơ bản tới nâng cao. Kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS.",
      buttonText: "ĐĂNG KÝ NGAY",
      image: "React.png",
      backgroundColors: "from-blue-600 to-purple-600",
    },
    {
      id: "html-css-beginners",
      title: "Học HTML CSS cho người mới 👑",
      description:
        "Thực hành dự án với Figma, hàng trăm bài tập, hướng dẫn 100% bởi Sơn Đặng, tặng kèm Flashcards, v.v.",
      buttonText: "HỌC THỬ MIỄN PHÍ",
      image: "Figma.png",
      backgroundColors: "from-purple-600 to-pink-500",
    },
  ];

  
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setDirection("right");
        setCurrentSlide((prev) => (prev + 1) % courses.length);
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [isPlaying, courses.length]);

  const nextSlide = (): void => {
    setDirection("right");
    setCurrentSlide((prev) => (prev + 1) % courses.length);
  };

  const prevSlide = (): void => {
    setDirection("left");
    setCurrentSlide((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const goToSlide = (index: number): void => {
    setDirection(index > currentSlide ? "right" : "left");
    setCurrentSlide(index);
  };

  return (
    <>
      <div className="relative">
        {}
        <div className="relative w-full h-[60vh] overflow-hidden rounded-3xl shadow-2xl">
          {courses.map((course, index) => (
            <section
              key={course.id}
              className={`absolute inset-0 py-12 px-4 bg-gradient-to-r ${
                index === currentSlide
                  ? "opacity-100 transform translate-x-0"
                  : direction === "right"
                  ? index < currentSlide
                    ? "opacity-0 transform -translate-x-full"
                    : "opacity-0 transform translate-x-full"
                  : index < currentSlide
                  ? "opacity-0 transform translate-x-full"
                  : "opacity-0 transform -translate-x-full"
              } py-12 px-4 bg-gradient-to-r ${
                course.backgroundColors
              } text-white`}
            >
              <div className="max-w-8xl mx-auto h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 h-full">
                  {}
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight animate-slide-up">
                      {course.title}
                    </h2>
                    <p className="text-lg md:text-xl opacity-90 leading-relaxed animate-slide-up-delay">
                      {course.description}
                    </p>

                    {course.price && (
                      <div className="flex items-center space-x-4 animate-slide-up-delay-2">
                        <span className="text-2xl font-bold line-through opacity-60">
                          {course.price.original}
                        </span>
                        <span className="text-4xl font-bold text-yellow-300">
                          {course.price.current}
                        </span>
                      </div>
                    )}

                    <div className="space-y-4 animate-slide-up-delay-3">
                      <button className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg text-lg">
                        {course.buttonText}
                      </button>

                      {course.price?.note && (
                        <p className="text-sm opacity-75">
                          {course.price.note}
                        </p>
                      )}
                    </div>
                  </div>

                  {}
                  <div className="relative flex justify-center lg:justify-end items-center h-full">
                    <div className="relative w-full max-w-2xl h-96 lg:h-full animate-float">
                      {course.image && (
                        <div className="relative w-full h-full">
                          <Image
                            src={`/images/${course.image}`}
                            alt={course.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                            className="object-contain drop-shadow-2xl"
                            priority={index === 0}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12 animate-pulse"></div>
              <div className="absolute top-1/2 left-10 w-16 h-16 bg-white opacity-3 rounded-full animate-bounce"></div>
            </section>
          ))}
        </div>

        {}
        <div className="absolute inset-0 pointer-events-none">
          {}
          <button
            onClick={prevSlide}
            className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm pointer-events-auto group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {}
          <button
            onClick={nextSlide}
            className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm pointer-events-auto group"
          >
            <svg
              className="w-4 h-6 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center space-y-4">
            {}
            <div className="flex space-x-3">
              {courses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "w-12 h-3 bg-white"
                      : "w-3 h-3 bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.4s both;
        }

        .animate-slide-up-delay-3 {
          animation: slide-up 0.8s ease-out 0.6s both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: slide-up 1s ease-out;
        }
      `}</style>
    </>
  );
};

export default CourseLandingSlider;
