"use client";
import { useEffect, useState } from "react";
import { BlogService } from "@/services/blog.service";
import { BlogPost } from "@/types/blog.types";
import Image from "next/image";
export default function MyPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeContent, setActiveContent] = useState<"draft" | "published">(
    "draft"
  );

  useEffect(() => {
    BlogService.getAll()
      .then(setPosts)
      .catch((err) => console.error(err));
  }, []);

  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <div className="p-6 ml-10">
      <h2 className="text-3xl font-bold mb-8">📝 Bài viết của tôi</h2>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveContent("draft")}
          className={`px-4 py-2 transition-all duration-200 ${
            activeContent === "draft"
              ? "text-black text-lg font-bold bg-transparent border-b-2 border-black"
              : "text-gray-400 text-lg hover:text-blue-400"
          }`}
        >
          Bản nháp ({drafts.length})
        </button>

        <button
          onClick={() => setActiveContent("published")}
          className={`px-4 py-2 transition-all duration-200 ${
            activeContent === "published"
              ? "text-black text-lg font-bold bg-transparent border-b-2 border-black"
              : "text-gray-400 text-lg hover:text-blue-400"
          }`}
        >
          Đã xuất bản ({published.length})
        </button>
      </div>

      {/* Hiển thị nội dung theo trạng thái */}
      {activeContent === "draft" && (
        <section>
          {drafts.length ? (
            drafts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow"
              >
                {/* Header với tên tác giả */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-800">{p.author}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(p.createdAt || "").toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Nội dung chính */}
                <div className="flex gap-6">
                  {/* Text bên trái */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">
                      {p.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {p.content}
                    </p>

                    {/* Tags và thông tin */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {p.category}
                      </span>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                        📝 Bản nháp
                      </span>
                    </div>
                  </div>

                  {/* Hình ảnh bên phải */}
                  {p.image && (
                    <div className="flex-shrink-0">
                      <div className="relative w-52 h-36 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">📭 Chưa có bài nháp nào</p>
            </div>
          )}
        </section>
      )}

      {activeContent === "published" && (
        <section>
          {published.length ? (
            published.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow"
              >
                {/* Header với tên tác giả */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-800">{p.author}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(p.createdAt || "").toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Nội dung chính */}
                <div className="flex gap-6">
                  {/* Text bên trái */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">
                      {p.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {p.content}
                    </p>

                    {/* Tags và thông tin */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {p.category}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        ✅ Đã xuất bản
                      </span>
                    </div>
                  </div>

                  {/* Hình ảnh bên phải */}
                  {p.image && (
                    <div className="flex-shrink-0">
                      <div className="relative w-52 h-36 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                📭 Chưa có bài viết nào được xuất bản
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
