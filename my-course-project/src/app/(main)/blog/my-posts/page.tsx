"use client";
import { useEffect, useState } from "react";
import { BlogService } from "@/services/blog.service";
import { BlogPost } from "@/types/blog.types";
export default function MyPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeContent, setActiveContent] = useState<"draft" | "published">("draft");

  useEffect(() => {
    BlogService.getAll()
      .then(setPosts)
      .catch((err) => console.error(err));
  }, []);

  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <div className="p-6 ml-10">
      <h2 className="text-3xl font-bold mb-24">📝 Bài viết của tôi</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveContent("draft")}
          className={`px-4 py-2 transition-all duration-200 ${
            activeContent === "draft"
              ? "text-black text-lg font-bold bg-transparent underline underline-offset-6"
              : "border-transparent text-black-400 text-lg hover:text-blue-400"
          }`}
        >
          Bản nháp ({drafts.length})
        </button>

        <button
          onClick={() => setActiveContent("published")}
          className={`px-4 py-2 transition-all duration-200 ${
            activeContent === "published"
              ? "text-black text-lg font-bold bg-transparent underline underline-offset-6"
              : "border-transparent text-black-400 text-lg hover:text-blue-400"
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
              <div key={p.id} className="p-3 border rounded mb-2">
                {p.title}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có bài nháp</p>
          )}
        </section>
      )}

      {activeContent === "published" && (
        <section>
          {published.length ? (
            published.map((p) => (
              <div key={p.id} className="p-3 border rounded mb-2">
                {p.title}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có bài viết nào được xuất bản</p>
          )}
        </section>
      )}
    </div>
  );
}
