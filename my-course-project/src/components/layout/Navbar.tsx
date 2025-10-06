"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CourseSearch from "../course/CourseSearch";
import AuthModal from "@/app/auth/AuthModal";
import { useAuth } from "@/content/AuthContent";
import ProfileMenu from "@/components/profile/ProfileMenu";

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Navbar({
  onLoginClick: propOnLoginClick,
  onRegisterClick: propOnRegisterClick,
}: NavbarProps) {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [showProfile, setShowProfile] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  // ✅ Dùng prop callback nếu có, nếu không dùng mặc định
  const handleRegisterClick =
    propOnRegisterClick ||
    (() => {
      setIsAuthModalOpen(true);
      setAuthView("register");
    });

  const handleLoginClick =
    propOnLoginClick ||
    (() => {
      setIsAuthModalOpen(true);
      setAuthView("login");
    });

  const onCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed top-0 left-0 w-full z-10">
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <Image src="/images/Brand.jpg" alt="logo" width={100} height={50} />
        <h2 className="text-sm font-semibold text-black">
          Học Tập Không Giới Hạn
        </h2>
      </div>

      {/* SEARCH */}
      <div className="flex-1 max-w-md mx-6">
        <CourseSearch onSearch={(query) => console.log(query)} />
      </div>

      {/* USER SECTION */}
      {user ? (
        <div className="relative flex items-center gap-3" ref={menuRef}>
          <a href="/user/courses" className="text-gray-700 font-medium">
            Khóa học của tôi
          </a>

          {/* Avatar có thể click */}
          <div
            className="rounded-full overflow-hidden cursor-pointer border border-gray-200"
            onClick={() => setShowProfile(!showProfile)}
          >
            <Image
              src={user.avatar || "/images/avatar.png"}
              alt={user.fullName || "User"}
              width={40}
              height={40}
            />
          </div>

          {/* Profile Menu thả xuống */}
          <div
            className={`absolute right-0 top-14 transition-all duration-300 ease-out transform origin-top-right ${
              showProfile
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <ProfileMenu />
          </div>
        </div>
      ) : (
        // Nút đăng nhập / đăng ký
        <div className="flex items-center gap-3">
          <button
            onClick={handleRegisterClick}
            className="bg-white text-black font-bold px-4 py-2 rounded"
          >
            Đăng ký
          </button>
          <button
            onClick={handleLoginClick}
            className="bg-orange-500 text-white font-bold px-4 py-2 rounded-3xl"
          >
            Đăng nhập
          </button>
        </div>
      )}

      {/* Modal đăng nhập / đăng ký */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuthModal}
        initialView={authView}
      />
    </div>
  );
}
