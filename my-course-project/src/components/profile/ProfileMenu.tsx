import React from "react";
import { useAuth } from "@/hooks/useAuth";
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

interface ProfileMenuProps {
  onClose: () => void;
}

export default function ProfileMenu({ onClose }: ProfileMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Logout clicked");
    try {
      await logout();
      await router.push("/");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigate = async (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Menu item clicked, navigating to:", href);
    try {
      await router.push(href);
      onClose();
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const menuItems = [
    { label: "Trang cá nhân", icon: <FiUser />, href: "/profile" },
    { label: "Viết blog", icon: <FiEdit />, href: "/blog/create" },
    { label: "Bài viết của tôi", icon: <FiBookOpen />, href: "/blog/my-posts" },
    // { label: "Bài viết đã lưu", icon: <FiBookmark />, href: "/blog/saved" },
    { label: "Cài đặt", icon: <FiSettings />, href: "/settings" },
  ];
  return (
    <div
      className="w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
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
            onClick={(e) => handleNavigate(e, item.href)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors"
          >
            <span className="text-gray-500">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center w-full gap-3 px-4 py-3 text-red-500 hover:bg-red-50 border-t border-gray-100 font-medium transition-colors"
      >
        <FiLogOut /> Đăng xuất
      </button>
    </div>
  );
}
