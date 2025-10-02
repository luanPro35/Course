import React from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Posts from "./Posts";
import LinkPosts from "./LinkPosts";
import { linkPosts } from "@/types/post";
import Link from "next/link";

export default function Route() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>
      <div className="flex flex-1 pt-16">
        <aside className="w-28 flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>
        <div className="flex flex-row items-start">
          {/* Bên trái: bài viết */}
          <div className="flex-1 px-6 md:px-12 py-8 pt-8 justify-start">
            <Posts />
          </div>

          {/* Bên phải: link + ảnh, dùng sticky */}
          <div className="w-[350px]  sticky top-24 mb-24">
            {/* Danh sách link */}
            <div className="px-6 md:px-12 py-8 pt-8">
              {linkPosts.map((item) => (
                <LinkPosts prop={item} key={item.id} />
              ))}
            </div>

            {/* Ảnh */}
            <div className="flex flex-col gap-6 justify-center items-center">
              <Link href="/images/PostF8.png">
                <Image
                  src="/images/PostF8.png"
                  alt="PostF8"
                  width={300}
                  height={300}
                />
              </Link>
              <Link href="/images/PostHTML.png">
                <Image
                  src="/images/PostHTML.png"
                  alt="PostHTML"
                  width={300}
                  height={300}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
