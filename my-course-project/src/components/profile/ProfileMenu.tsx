import React from "react";
import { useAuth } from "@/content/AuthContent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiLogOut,
  FiSettings,
  FiBookOpen,
  FiEdit,
  FiBookmark,
  FiUser,
} from "react-icons/fi";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    { label: "Trang cá nhân", icon: <FiUser />, href: "/profile" },
    { label: "Khóa học của tôi", icon: <FiBookOpen />, href: "/user/courses" },
    { label: "Bài tập của tôi", icon: <FiEdit />, href: "/user/exercises" },
    { label: "Viết blog", icon: <FiEdit />, href: "/blog/create" },
    { label: "Bài viết của tôi", icon: <FiBookOpen />, href: "/blog/my-posts" },
    { label: "Bài viết đã lưu", icon: <FiBookmark />, href: "/blog/saved" },
    { label: "Cài đặt", icon: <FiSettings />, href: "/settings" },
  ];
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <Image
          src={user?.avatar || "/images/avatar.png"}
          alt={user?.fullName || "User Avatar"}
          width={45}
          height={45}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-800">{user?.fullName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <ul className="py-2">
        {menuItems.map((item) => (
          <li
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
          >
            <span className="text-gray-500">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center w-full gap-3 px-4 py-3 text-red-500 hover:bg-red-50 border-t border-gray-100 font-medium"
      >
        <FiLogOut /> Đăng xuất
      </button>
    </div>
  );
}
