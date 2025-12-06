"use client";
import { enrollInFreeCourse } from "@/services/enrollment.service";
import type { CourseFree } from "@/types/courseFree";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FreeCoursesBtnProps {
  course: CourseFree;
}

export default function FreeCourseBtn({ course }: FreeCoursesBtnProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (course: CourseFree) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        alert("Bạn cần đăng nhập để đăng ký khóa học.");
        router.push("/login");
        return;
      }

      await enrollInFreeCourse(course.id, token);
      
      alert("Đăng ký khóa học thành công! Bạn có thể bắt đầu học ngay.");
      
      router.push(`/my-courses`);
    } catch (error: any) {
      console.error("Error registering course:", error);
      setError(error.message || "Đăng ký khóa học thất bại");
      alert(error.message || "Đăng ký khóa học thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleRegister(course)}
        disabled={loading}
        className="relative inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl shadow-blue-500/70 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        <span className="relative z-10 drop-shadow-lg">
          {loading ? "Đang xử lý..." : "Đăng ký học"}
        </span>
      </button>
    </div>
  );
}
