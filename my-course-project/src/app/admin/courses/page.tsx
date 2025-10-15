"use client";
import React from "react";
import { useState } from "react";
export default function ManagerPosts() {
  const [activeTab, setActiveTab] = useState<"free" | "pro" | "video" | "post">(
    "free"
  );
  return (
    <div>
      return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">🎛️ Quản lý nội dung</h1>

        {/* Thanh chọn loại nội dung */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("free")}
            className={`px-4 py-2 rounded-3xl transition-all duration-200 ${
              activeTab === "free"
                ? "bg-blue-600 text-white font-semibold"
                : "bg-transparent border border-gray-300 text-gray-700 hover:text-black"
            }`}
          >
            Đăng khóa học Free
          </button>

          <button
            onClick={() => setActiveTab("pro")}
            className={`px-4 py-2 rounded-3xl transition-all duration-200 ${
              activeTab === "pro"
                ? "bg-blue-600 text-white font-semibold"
                : "bg-transparent border border-gray-300 text-gray-700 hover:text-black"
            }`}
          >
            Đăng khóa học Pro
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 rounded-3xl transition-all duration-200 ${
              activeTab === "video"
                ? "bg-blue-600 text-white font-semibold"
                : "bg-transparent border border-gray-300 text-gray-700 hover:text-black"
            }`}
          >
            Đăng video
          </button>
        </div>

        {/* Phần hiển thị nội dung tương ứng */}
        {activeTab === "free" && (
          <div className="p-4 border rounded-xl bg-gray-50">
            <h2 className="text-xl font-semibold mb-3">
              📘 Đăng khóa học miễn phí
            </h2>
            <p>Form nhập thông tin khóa học Free sẽ hiển thị ở đây...</p>
            {/* TODO: thêm form nhập thông tin free course */}
          </div>
        )}

        {activeTab === "pro" && (
          <div className="p-4 border rounded-xl bg-gray-50">
            <h2 className="text-xl font-semibold mb-3">💎 Đăng khóa học Pro</h2>
            <p>Form nhập thông tin khóa học Pro sẽ hiển thị ở đây...</p>
            {/* TODO: thêm form nhập thông tin pro course */}
          </div>
        )}

        {activeTab === "video" && (
          <div className="p-4 border rounded-xl bg-gray-50">
            <h2 className="text-xl font-semibold mb-3">
              🎬 Đăng video học tập
            </h2>
            <p>Form nhập thông tin video sẽ hiển thị ở đây...</p>
            {/* TODO: thêm form nhập thông tin video */}
          </div>
        )}
      </div>
      );
    </div>
  );
}
