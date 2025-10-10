"use client";
import React, { useState, useEffect } from "react";
import { SavedService } from "@/services/saved.service";
import { BlogPost } from "@/types/blog.types";
import Image from "next/image";

export default function SavedPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    SavedService.getAll().then((data) => setPosts(data));
  }, []);

  const handleToggle = async (post: BlogPost) => {
    try {
      console.log("Attempting to delete post:", post.id);
      await SavedService.delete(post.id);
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
      console.log("Post deleted successfully, UI updated.");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div>
      <div className="p-6 ml-10">
        <h2 className="text-3xl font-bold mb-6">📑 Bài viết đã lưu</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">Chưa có bài nào được lưu</p>
        ) : (
          posts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow min-h-64 max-w-3xl"
            >
              {/* Header với tên tác giả */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-800">{p.author}</span>
                <button
                  onClick={() => handleToggle(p)}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors cursor-pointer"
                >
                  ❌
                </button>
              </div>

              {/* Nội dung chính */}
              <div className="flex gap-6">
                {/* Text bên trái */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">
                    {p.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {p.content}
                  </p>

                  {/* Tags và thông tin */}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {p.category}
                    </span>
                  </div>
                </div>

                {/* Hình ảnh bên phải */}
                <div className="flex-shrink-0">
                  <div className="relative w-52 h-36 rounded-xl overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
