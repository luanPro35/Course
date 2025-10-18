"use client";
import { useEffect, useState } from "react";
import { BlogService } from "@/services/blog.service"; // Force re-import
import { BlogPost } from "@/types/blog.types";
import { PostItem } from "./PostItem";
import { useRouter } from "next/navigation";

export default function MyPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeContent, setActiveContent] = useState<"draft" | "published">(
    "draft"
  );

  const handleDelete = (id: number | string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      BlogService.delete(id)
        .then(() => {
          setPosts((prevPosts) => prevPosts.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error("Lỗi khi xóa bài viết:", error);
          alert(`Lỗi khi xóa bài viết: ${error.message}`);
        });
    }
  };

  const handleEdit = (id: number | string) => {
    router.push(`/blog/create?id=${id}`);
  };

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
              <PostItem
                key={p.id}
                post={p}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
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
              <PostItem
                key={p.id}
                post={p}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))
          ) : (
            <p className="text-gray-500">Chưa có bài viết nào được xuất bản</p>
          )}
        </section>
      )}
    </div>
  );
}
