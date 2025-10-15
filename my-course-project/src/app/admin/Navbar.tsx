import React from "react";

export default function Navbar() {
  const ManagerTab = [
    { href: "/admin/posts", label: "Quản lí bài đăng" },
    { href: "/admin/courses", label: "Quản lí khóa học" },
    { href: "/admin/users", label: "Quản lí người dùng" },
    { href: "/admin/settings", label: "Cài đặt" },
  ];
  return (
    <div>
      {ManagerTab.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </div>
  );
}
