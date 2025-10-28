"use client";
import { addCoursesToUser } from "@/services/user.service";
import type { CourseFree } from "@/types/courseFree";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth hook

interface FreeCoursesBtnProps {
  course: CourseFree; // Only need the course object, not its ID as a prop
}
export default function FreeCourseBtn({ course }: FreeCoursesBtnProps) {
  const { user } = useAuth(); // Get current user from auth context
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (course: CourseFree) => {
    if (!user?.id) {
      alert("Bạn cần đăng nhập để đăng ký khóa học."); // User not logged in
      return;
    }

    setLoading(true);
    try {
      await addCoursesToUser(user.id, course); // Pass user.id instead of course.id
      router.refresh(); // Force a refresh of the current route
      alert("Đăng kí khóa học thành công");
    } catch (error) {
      console.error("Error registering course:", error);
      alert("Đăng kí khóa học thất bại.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        onClick={() => handleRegister(course)}
        disabled={loading}
        className="relative inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl shadow-blue-500/70 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        <span className="relative z-10 drop-shadow-lg">
          {loading ? "Đang lưu..." : "Đăng ký học"}
        </span>
      </button>
    </div>
  );
}
