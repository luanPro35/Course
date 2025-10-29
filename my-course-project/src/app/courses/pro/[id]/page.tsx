import { CoursePro } from "@/types/coursePro";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseThreadBackground from "@/components/ui/Background";

export default function CoursePage() {
  return (
    <CourseThreadBackground>
      <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 rounded-lg p-3">
                <Image
                  src="/images/Brand.png"
                  width={60}
                  height={60}
                  alt="Brand logo"
                  className="object-contain"
                />
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
                  ⭐ Khóa học bán chạy nhất 2024
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Cách dễ nhất để học{" "}
                  <span className="text-amber-500">HTML/CSS</span> cho người mới
                  bắt đầu!
                </h1>
                <h2 className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                  Thực hành 8 dự án trên Figma, 300+ bài tập và thử thách, mua
                  một lần học mãi mãi, được thiết kế và hướng dẫn bởi chuyên gia
                </h2>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl">
                    Bắt đầu học ngay →
                  </button>
                  <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-4 rounded-lg text-lg border-2 border-gray-300 transition-colors">
                    Xem giới thiệu
                  </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                        />
                      ))}
                    </div>
                    <span>2,500+ học viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★★★★★</span>
                    <span className="font-semibold">4.9</span>
                    <span>(1,234 đánh giá)</span>
                  </div>
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
                      <div className="text-purple-600">&lt;html&gt;</div>
                      <div className="text-blue-600 pl-4">&lt;body&gt;</div>
                      <div className="text-green-600 pl-8">
                        &lt;h1&gt;Hello World!&lt;/h1&gt;
                      </div>
                      <div className="text-blue-600 pl-4">&lt;/body&gt;</div>
                      <div className="text-purple-600">&lt;/html&gt;</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-amber-600 mb-2">8</p>
              <p className="text-gray-600 font-medium">Dự án thực tế</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-amber-600 mb-2">300+</p>
              <p className="text-gray-600 font-medium">Bài tập & Thử thách</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-amber-600 mb-2">∞</p>
              <p className="text-gray-600 font-medium">Truy cập trọn đời</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-amber-600 mb-2">24/7</p>
              <p className="text-gray-600 font-medium">Hỗ trợ học viên</p>
            </div>
          </div>

          {/* Course Preview Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Nội dung khóa học
                </h3>
                <p className="text-gray-600">
                  12 chương • 156 bài học • 24 giờ video
                </p>
              </div>
              <button className="text-amber-600 font-semibold hover:text-amber-700">
                Xem tất cả →
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  title: "Giới thiệu về HTML",
                  desc: "Tìm hiểu cấu trúc cơ bản của HTML",
                  lessons: 12,
                  duration: "2h 15m",
                },
                {
                  title: "CSS Fundamentals",
                  desc: "Styling và layout với CSS",
                  lessons: 18,
                  duration: "3h 30m",
                },
                {
                  title: "Responsive Design",
                  desc: "Thiết kế responsive cho mọi thiết bị",
                  lessons: 15,
                  duration: "2h 45m",
                },
                {
                  title: "Flexbox & Grid",
                  desc: "Layout hiện đại với Flexbox và Grid",
                  lessons: 20,
                  duration: "4h 10m",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 text-lg">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">{item.desc}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📚 {item.lessons} bài học</span>
                      <span>⏱️ {item.duration}</span>
                    </div>
                  </div>
                  <div className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Bạn sẽ học được gì?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Nắm vững cú pháp HTML5 và cấu trúc semantic",
                "Styling chuyên nghiệp với CSS3",
                "Responsive design cho mọi thiết bị",
                "Flexbox và CSS Grid layouts",
                "Animation và transitions",
                "Best practices trong web development",
                "8 dự án thực tế từ cơ bản đến nâng cao",
                "Kỹ năng debug và tối ưu hóa code",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-12 text-white text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Sẵn sàng bắt đầu hành trình của bạn?
            </h3>
            <p className="text-xl mb-8 text-amber-50">
              Chỉ với 599.000₫ - Truy cập trọn đời, không phí ẩn
            </p>
            <button className="bg-white text-amber-600 font-bold px-10 py-4 rounded-lg text-lg hover:bg-gray-100 transition-colors shadow-xl">
              Đăng ký ngay - 599.000₫
            </button>
            <p className="text-sm mt-4 text-amber-100">
              🎁 Tặng kèm 50+ templates HTML/CSS miễn phí
            </p>
          </div>
        </div>
      </div>
    </CourseThreadBackground>
  );
}
