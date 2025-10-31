"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaUser, FaBell } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
const links = [
  { href: "/settings", label: "Thông tin cá nhân", icon: <FaUser /> },
];
export default function SettingsSidebar() {
  const pathname = usePathname();
  return (
    <div>
      <ul className="space-y-2">
        {links.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
