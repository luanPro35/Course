"use client";

import React from "react";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { BiSolidNote } from "react-icons/bi";
import { MdOutlineArticle } from "react-icons/md";

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Trang chủ", icon: <AiFillHome size={24} /> },
    { href: "/route", label: "Lộ trình", icon: <BiSolidNote size={24} /> },
    {
      href: "/article",
      label: "Bài viết",
      icon: <MdOutlineArticle size={24} />,
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 w-32 bg-white h-screen">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors ${
            pathname === link.href
              ? "bg-gray-300 text-black"
              : "hover:bg-gray-200 text-black"
          }`}
        >
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
