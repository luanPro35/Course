"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CourseSearch from "../course/CourseSearch";
import AuthModal from "@/app/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import ProfileMenu from "@/components/profile/ProfileMenu";
import MyCoursesDropdown from "@/components/course/MyCoursesDropdown"; 
import {
  FiArrowLeft as ArrowLeft,
  FiMenu,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ROUTES_WITH_BACK_BUTTON } from "@/constants/routes";
import { courseService } from "@/services/course.service"; 
import { CourseFree } from "@/types/courseFree"; 

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
  const [showMyCoursesDropdown, setShowMyCoursesDropdown] = useState(false);
  const [myCourses, setMyCourses] = useState<CourseFree[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const desktopProfileMenuRef = useRef<HTMLDivElement>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  const myCoursesMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  
  const showBackButton = ROUTES_WITH_BACK_BUTTON.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      const isDesktopProfileClick =
        desktopProfileMenuRef.current?.contains(targetNode);
      const isMobileProfileClick =
        mobileProfileMenuRef.current?.contains(targetNode);

      if (!isDesktopProfileClick && !isMobileProfileClick) {
        setShowProfile(false);
      }

      if (
        myCoursesMenuRef.current &&
        !myCoursesMenuRef.current.contains(targetNode)
      ) {
        setShowMyCoursesDropdown(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(targetNode) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(targetNode)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.id && showMyCoursesDropdown) {
      const fetchCourses = async () => {
        const courses = await courseService.getMyCourses();
        setMyCourses(courses);
      };
      fetchCourses();
    }
  }, [user?.id, showMyCoursesDropdown]);
  useEffect(() => {
    if (user) {
      console.log("User loaded in Navbar:", user.fullName);
    }
  }, [user]);
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
      setIsMobileMenuOpen(false);
    });

  const onCloseAuthModal = () => setIsAuthModalOpen(false);

  const handleCloseProfileMenu = () => {
    setShowProfile(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 md:px-6 py-3 shadow-md bg-white fixed top-0 left-0 w-full z-40">
      {}
      <div className="flex items-center gap-3">
        {}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/images/Brand.jpg"
            alt="logo"
            width={100}
            height={50}
            className="object-contain cursor-pointer"
          />
        </Link>

        {}
        {showBackButton ? (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition"
          >
            <ArrowLeft size={22} />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
        ) : (
          <h2 className="text-sm font-semibold text-black hidden lg:block">
            Học Tập Không Giới Hạn
          </h2>
        )}
      </div>

      {}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <CourseSearch onSearch={(query) => console.log(query)} />
      </div>

      {}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            {}
            <div className="relative" ref={myCoursesMenuRef}>
              <button
                onClick={() => setShowMyCoursesDropdown(!showMyCoursesDropdown)}
                className="text-gray-700 font-medium hover:text-orange-600 transition px-3 py-2 rounded-md"
              >
                Khóa học của tôi
              </button>
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-14 pr-20 transition-all duration-300 ease-out transform origin-top z-50 ${
                  showMyCoursesDropdown
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <MyCoursesDropdown courses={myCourses} />
              </div>
            </div>

            <div className="relative" ref={desktopProfileMenuRef}>
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

              {}
              <div
                className={`absolute right-0 top-14 transition-all duration-300 ease-out transform origin-top-right z-50 ${
                  showProfile
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <ProfileMenu onClose={handleCloseProfileMenu} />
              </div>
            </div>
          </>
        ) : (
          
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
      </div>

      {}
      <div className="md:hidden flex items-center gap-4">
        {user && (
          <div className="relative" ref={mobileProfileMenuRef}>
            <div
              className="rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-500 transition"
              onClick={() => setShowProfile(!showProfile)}
            >
              <Image
                src={user.avatar || "/images/avatar.png"}
                alt={user.fullName || "User"}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div
              className={`absolute right-0 top-12 transition-all duration-300 ease-out transform origin-top-right z-50 ${
                showProfile
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <ProfileMenu onClose={handleCloseProfileMenu} />
            </div>
          </div>
        )}
        <button
          ref={mobileMenuButtonRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 hover:text-orange-600 transition"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {}
      <div
        ref={mobileMenuRef}
        className={`absolute top-full left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-out transform z-70 ${
          isMobileMenuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-4">
          <CourseSearch onSearch={(query) => console.log(query)} />
        </div>
        {user && (
          <div className="border-t">
            <Link
              href="/"
              className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/route"
              className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Lộ trình
            </Link>
            <Link
              href="/article"
              className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bài viết
            </Link>
            <button
              onClick={() => {
                setShowMyCoursesDropdown(!showMyCoursesDropdown);
              }}
              className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Khóa học của tôi
            </button>
            {showMyCoursesDropdown && (
              <div className="p-4 bg-gray-50">
                <MyCoursesDropdown courses={myCourses} />
              </div>
            )}
          </div>
        )}
        {!user && (
          <div className="p-4 border-t flex flex-col gap-2">
            <button
              onClick={handleRegisterClick}
              className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-100 transition w-full border"
            >
              Đăng ký
            </button>
            <button
              onClick={handleLoginClick}
              className="bg-orange-500 text-white font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition w-full"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>

      {}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuthModal}
        initialView={authView}
      />
    </nav>
  );
}
