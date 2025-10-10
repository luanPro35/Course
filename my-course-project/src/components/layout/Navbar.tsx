"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CourseSearch from "../course/CourseSearch";
import AuthModal from "@/app/auth/AuthModal";
import { useAuth } from "@/content/AuthContent";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { FiArrowLeft as ArrowLeft } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ROUTES_WITH_BACK_BUTTON } from "@/constants/routes";

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Navbar({
  onLoginClick: propOnLoginClick,
  onRegisterClick: propOnRegisterClick,
}: NavbarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if the current route should have a back button
  const showBackButton = ROUTES_WITH_BACK_BUTTON.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const onCloseAuthModal = () => setIsAuthModalOpen(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed top-0 left-0 w-full z-10">
      {/* LOGO + Quay lại / Tiêu đề */}
      <div className="flex items-center gap-3">
        {/* Logo luôn hiển thị */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/Brand.jpg"
            alt="logo"
            width={100}
            height={50}
            className="object-contain cursor-pointer"
          />
        </Link>

        {/* Nếu ở route đặc biệt thì hiện "Quay lại", ngược lại thì hiện tiêu đề */}
        {showBackButton ? (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition"
          >
            <ArrowLeft size={22} />
            <span>Quay lại</span>
          </button>
        ) : (
          <h2 className="text-sm font-semibold text-black hidden md:block">
            Học Tập Không Giới Hạn
          </h2>
        )}
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="flex-1 max-w-md mx-6">
        <CourseSearch onSearch={(query) => console.log(query)} />
      </div>

      {/* USER SECTION */}
      {user ? (
        <div className="relative flex items-center gap-3" ref={menuRef}>
          <Link
            href="/user/courses"
            className="text-gray-700 font-medium hover:text-orange-600 transition"
          >
            Khóa học của tôi
          </Link>

          <div
            className="rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-500 transition"
            onClick={() => setShowProfile(!showProfile)}
          >
            <Image
              src={user.avatar || "/images/avatar.png"}
              alt={user.fullName || "User"}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>

          {/* Profile menu thả xuống */}
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
        // Nút đăng ký / đăng nhập
        <div className="flex items-center gap-3">
          <button
            onClick={handleRegisterClick}
            className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Đăng ký
          </button>
          <button
            onClick={handleLoginClick}
            className="bg-orange-500 text-white font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition"
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
    </nav>
  );
}
