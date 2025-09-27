"use client";

import React, { useState } from "react";
import Image from "next/image";
import CourseSearch from "../course/CourseSearch";
import RegisterForm from "../auth/RegisterForm";
import LoginForm from "../auth/LoginForm";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-xl relative max-w-lg w-full">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
      >
        &times;
      </button>
      <div className="max-h-[90vh]">{children}</div>
    </div>
  </div>
);

export default function Navbar() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
  };

  const handleCloseModal = () => {
    setShowRegisterForm(false);
    setShowLoginForm(false);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed top-0 left-0 w-full z-10">
      <div className="flex items-center gap-3">
        <Image src="/images/Brand.png" alt="logo" width={100} height={50} />
        <h2 className="text-sm font-semibold text-black">
          Học Tập Không Giới Hạn
        </h2>
      </div>

      <div className="flex-1 max-w-md mx-6">
        <CourseSearch onSearch={(query) => console.log(query)} />
      </div>

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

      {showRegisterForm && (
        <Modal onClose={handleCloseModal}>
          <RegisterForm onClose={handleCloseModal} />
        </Modal>
      )}
      {showLoginForm && (
        <Modal onClose={handleCloseModal}>
          <LoginForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
