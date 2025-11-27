"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const ManagerTab = [
    {
      label: "Bảng điều khiển",
      href: "/admin/dashboard",
      children: [
        { href: "/admin/dashboard", label: "Thống kê" },
        { href: "/admin/analytics", label: "Phân tích" },
        { href: "/admin/total_products", label: "Tổng sản phẩm" },
      ],
    },
    {
      label: "Quản lí khóa học",
      href: "/admin/courses",
      children: [
        { href: "/admin/courses", label: "Khóa học" },
        { href: "/admin/courses/create", label: "Tạo khóa học" },
        { href: "/admin/courses/bill", label: "Hóa đơn" },
      ],
    },
    { href: "/admin/users", label: "Quản lí người dùng" },
  ];

  return (
    <nav className="bg-white shadow-lg h-screen w-1/5 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        {}
        <div className="p-6 border-b">
          <Link href="/" className="flex flex-col items-center gap-3">
            <Image
              src="/images/Brand.jpg"
              alt="logo"
              width={100}
              height={50}
              className="object-contain cursor-pointer"
            />
            <h2 className="text-base font-semibold text-black text-center">
              Học Tập Không Giới Hạn
            </h2>
          </Link>
        </div>

        <div className="flex flex-col p-4 space-y-2">
          {ManagerTab.map((item) => (
            <div key={item.label}>
              <button
                onClick={() =>
                  setOpenMenu(openMenu === item.label ? null : item.label)
                }
                className="flex justify-between items-center w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out font-medium text-base group"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  {item.label}
                </span>
                {item.children && (
                  <ChevronRight
                    size={18}
                    className={`transition-all duration-300 ease-in-out ${
                      openMenu === item.label
                        ? "rotate-90 text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  item.children && openMenu === item.label
                    ? "max-h-96 opacity-100 mt-1"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.children && (
                  <ul className="pl-6 space-y-1">
                    {item.children.map((child, index) => (
                      <li
                        key={child.href}
                        className={`transform transition-all duration-300 ease-out ${
                          openMenu === item.label
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-4 opacity-0"
                        }`}
                        style={{
                          transitionDelay:
                            openMenu === item.label ? `${index * 50}ms` : "0ms",
                        }}
                      >
                        <Link
                          href={child.href}
                          className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md text-base transition-all duration-200 hover:translate-x-1 hover:shadow-sm"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
