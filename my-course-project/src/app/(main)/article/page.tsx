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
    <div className="flex flex-col lg:flex-row items-start w-full lg:-ml-10 -mt-10">
      {}
      <div className="w-full lg:w-[350px] lg:sticky top-24 mb-8 lg:mb-24 ml-0 lg:ml-12 mt-8 lg:mt-0 order-1 lg:order-2">
        {}
        <div className="px-4 md:px-6 lg:px-0">
          <h3 className="text-lg font-bold mb-4 lg:hidden">Chủ đề</h3>
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
            {}
            <div
              onClick={handleResetFilter}
              className={`text-center lg:text-left px-4 py-2 text-sm font-medium rounded-2xl border cursor-pointer transition-all ${
                selectedCategories.length === 0
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-black border-blue-500 hover:bg-blue-50"
              }`}
            >
              Tất cả bài viết
            </div>

            {}
            {linkPosts.map((item) => (
              <div
                key={item.id}
                onClick={() => handleFilterClick(item.categories)}
                className={`text-center lg:text-left px-4 py-2 text-sm font-medium rounded-2xl border cursor-pointer transition-all ${
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
        </div>

        {}
        <div className="hidden lg:flex flex-col gap-6 justify-center items-center mt-8">
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

      {}
      <div className="flex-1 px-4 md:px-6 lg:px-12 py-8 justify-start w-full order-2 lg:order-1">
        <Posts filterCategories={selectedCategories} />
      </div>
    </div>
  );
}
