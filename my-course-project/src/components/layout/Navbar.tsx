"use client";

import React from "react";
import Image from "next/image";
import CourseSearch from "../course/CourseSearch";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
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

      <div className="flex items-center gap-3">
        <button
          onClick={onRegisterClick}
          className="bg-white-500 text-black font-bold px-4 py-2 rounded"
        >
          Đăng ký
        </button>
        <button
          onClick={onLoginClick}
          className="bg-orange-500 text-white font-bold px-4 py-2 rounded-3xl"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
