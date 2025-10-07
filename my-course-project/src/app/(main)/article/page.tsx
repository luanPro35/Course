"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Posts from "./Posts";
import LinkPosts from "./LinkPosts";
import { linkPosts } from "@/types/post";

export default function RoutePage() {
  return (
    <div className="flex flex-row items-start w-full -ml-10 -mt-10">
      {/* Bên trái: Danh sách bài viết */}
      <div className="flex-1 px-6 md:px-12 py-8 pt-8 justify-start">
        <Posts />
      </div>

      {/* Bên phải: Link + Ảnh (dạng sticky) */}
      <div className="w-[350px] sticky top-24 mb-24 hidden lg:block ml-12">
        {/* Danh sách link bài viết */}
        <div className="px-6 md:px-12 py-8 pt-8">
          {linkPosts.map((item) => (
            <LinkPosts prop={item} key={item.id} />
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
