"use client";

import React, { useState } from "react";
import Image from "next/image";
import CourseSearch from "../course/CourseSearch";
import AuthModal from "@/app/auth/AuthModal";
import { useAuth } from "@/content/AuthContent";
interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Navbar({
  onLoginClick: propOnLoginClick,
  onRegisterClick: propOnRegisterClick,
}: NavbarProps) {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  // Use prop functions if provided, otherwise use internal ones
  const internalOnRegisterClick = () => {
    setIsAuthModalOpen(true);
    setAuthView("register");
  };
  const handleRegisterClick = propOnRegisterClick || internalOnRegisterClick;

  const internalOnLoginClick = () => {
    setIsAuthModalOpen(true);
    setAuthView("login");
  };
  const handleLoginClick = propOnLoginClick || internalOnLoginClick;

  const onCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed top-0 left-0 w-full z-10">
      <div className="flex items-center gap-3">
        <Image src="/images/Brand.jpg" alt="logo" width={100} height={50} />
        <h2 className="text-sm font-semibold text-black">
          Học Tập Không Giới Hạn
        </h2>
      </div>

      <div className="flex-1 max-w-md mx-6">
        <CourseSearch onSearch={(query) => console.log(query)} />
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <a href="/user/courses" className="text-gray-700 font-medium">
            Khóa học của tôi
          </a>
          <Image
            src={user.avatar || "/images/avatar.jpg"}
            alt={user.name}
            width={40}
            height={40}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={handleRegisterClick}
            className="bg-white-500 text-black font-bold px-4 py-2 rounded"
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuthModal}
        initialView={authView}
      />
    </div>
  );
}
