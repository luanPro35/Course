"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Posts from "./Posts";
import LinkPosts from "./LinkPosts";
const linkPosts = [
  {
    id: 1,
    title: "Frontend",
    categories: [
      "Front-end",
      "ReactJS",
      "Javascript",
      "hoc-lap-trinh",
      "javascript",
    ],
  },
  {
    id: 2,
    title: "Backend",
    categories: ["Backend", "OOP", "python", "cpp"],
  },
  {
    id: 3,
    title: "DevOps",
    categories: ["DevOps", "Ubuntu", "devops"],
  },
  {
    id: 4,
    title: "Mobile",
    categories: ["Mobile", "React Native", "react-native"],
  },
];

export { linkPosts };

export default function RoutePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleFilterClick = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleResetFilter = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="flex flex-row items-start w-full -ml-10 -mt-10">
      {/* Bên trái: Danh sách bài viết */}
      <div className="flex-1 px-6 md:px-12 py-8 pt-8 justify-start">
        <Posts filterCategories={selectedCategories} />
      </div>

      {/* Bên phải: Link + Ảnh (dạng sticky) */}
      <div className="w-[350px] sticky top-24 mb-24 hidden lg:block ml-12">
        {/* Danh sách link bài viết */}
        <div className="px-6 md:px-12 py-8 pt-8">
          {/* Nút "Tất cả bài viết" */}
          <div
            onClick={handleResetFilter}
            className={`mb-2 px-4 py-2 text-sm font-medium rounded-2xl border cursor-pointer transition-all ${
              selectedCategories.length === 0
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-black border-blue-500 hover:bg-blue-50"
            }`}
          >
            Tất cả bài viết
          </div>

          {linkPosts.map((item) => (
            <div
              key={item.id}
              onClick={() => handleFilterClick(item.categories)}
              className={`mb-2 px-4 py-2 text-sm font-medium rounded-2xl border cursor-pointer transition-all ${
                JSON.stringify(selectedCategories) ===
                JSON.stringify(item.categories)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-black border-blue-500 hover:bg-blue-50"
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>

        {/* Hình minh họa */}
        <div className="flex flex-col gap-6 justify-center items-center">
          <Link href="/images/PostF8.png">
            <Image
              src="/images/PostF8.png"
              alt="PostF8"
              width={300}
              height={300}
              className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <Link href="/images/PostHTML.png">
            <Image
              src="/images/PostHTML.png"
              alt="PostHTML"
              width={300}
              height={300}
              className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
