// pages/index.tsx
import React from "react";
import Head from "next/head";
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

const CourseLandingPage: React.FC = () => {
  const courses: CourseSection[] = [
    {
      id: "javascript-pro",
      title: "Mở bán khóa JavaScript Pro 👑",
      description:
        "Từ 08/08/2024 khóa học sẽ có giá 1.399k. Khi khóa học hoàn thiện sẽ trở về giá gốc.",
      buttonText: "HỌC THỬ MIỄN PHÍ",
      image: "BuyCourse.png",
      backgroundColors: "from-purple-600 to-purple-700",
      price: {
        original: "3.299K",
        current: "1.199K",
        note: "*Dành cho tài khoản đã pre-order khóa HTML, CSS Pro",
      },
    },
    {
      id: "f8-youtube",
      title: "F8 trên Youtube",
      description:
        "F8 được nhắc tới ở mọi nơi, ở đâu có có hỏi việc làm cho nghề IT và có những con người yêu thích lập trình F8 sẽ ở đó.",
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

  return (
    <>
      <div className="min-h-screen">
        {/* Course Sections */}
        <main className="space-y-0">
          {courses.map((course) => (
            <section
              key={course.id}
              className={`relative py-20 px-4 bg-gradient-to-r ${course.backgroundColors} text-white overflow-hidden`}
            >
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                      {course.title}
                    </h2>
                    <p className="text-lg opacity-90 leading-relaxed">
                      {course.description}
                    </p>

                    {course.price && (
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold line-through opacity-60">
                          {course.price.original}
                        </span>
                        <span className="text-4xl font-bold text-yellow-300">
                          {course.price.current}
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <button className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-100 transition-colors">
                        {course.buttonText}
                      </button>

                      {course.price?.note && (
                        <p className="text-sm opacity-75">
                          {course.price.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    {/* Placeholder for course illustrations */}
                    <div className="flex justify-end items-center h-full">
                      <div className="relative w-[80rem] h-full">
                        <Image
                          src={`/images/${
                            courses.find((c) => c.id === course.id)?.image
                          }`}
                          alt={course.title}
                          width={1280}
                          height={1280}
                          objectFit="contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
            </section>
          ))}
        </main>
      </div>
    </>
  );
};

export default CourseLandingPage;
