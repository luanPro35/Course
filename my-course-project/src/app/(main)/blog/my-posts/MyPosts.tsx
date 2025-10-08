"use client";
import { useEffect, useState } from "react";
import { BlogService } from "@/services/blog.service";
import { BlogPost } from "@/types/blog.types";
import { BlogPreview } from "../create/BlogPreview";
export default function MyPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    BlogService.getAll()
      .then(setPosts)
      .catch((err) => console.error(err));
  }, []);

  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <div className="p-6 ml-10">
      <h2 className="text-3xl font-bold mb-6">📝 Bài viết của tôi</h2>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-3">
          Bản nháp ({drafts.length})
        </h3>
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

      <section>
        <h3 className="text-lg font-semibold mb-3">
          Đã xuất bản ({published.length})
        </h3>
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
    </div>
  );
}
