import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseLandingPage from "@/components/ui/Slider";
import Sidebar from "@/components/layout/Sidebar";
import CoursePro from "@/app/courses/[id]/CoursePro";
import { courses } from "@/types/coursePro";
import { courseFree } from "@/types/courseFree";
import CourseFree from "./courses/[id]/CourseFree";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-32 pt-24">
          <Sidebar />
        </div>
        <main className="flex-1 px-12 py-8 pt-24">
          <CourseLandingPage />
          <div className="pt-14 px-6">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Khóa học Pro
              </h1>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg shadow-lg transform -translate-y-2 hover:scale-105 transition-all duration-300">
                  <span className="text-white text-sm font-bold tracking-wide">
                    MỚI
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8 ">
              {courses.map((course) => (
                <CoursePro key={course.id} course={course} />
              ))}
            </div>
          </div>
          <div className="pt-14 px-6">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Khóa học miễn phí
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8 ">
              {courseFree.map((course) => (
                <CourseFree key={course.id} course={course} />
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
