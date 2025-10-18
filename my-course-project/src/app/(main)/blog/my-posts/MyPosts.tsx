"use client";
import { useEffect, useState } from "react";
import { BlogService } from "@/services/blog.service";
import { BlogPost } from "@/types/blog.types";
import Image from "next/image";
import { PostItem } from "./PostItem";
import { useRouter } from "next/navigation";

export default function MyPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeContent, setActiveContent] = useState<"draft" | "published">(
    "draft"
  );
  const router = useRouter();

  useEffect(() => {
    BlogService.getAll()
      .then(setPosts)
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      return;
    }
    try {
      await BlogService.delete(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      alert("Xóa bài viết thành công!");
    } catch (error) {
      console.error("Failed to delete post:", error);
      if (error instanceof Error) {
        alert(`Lỗi khi xóa bài viết: ${error.message}`);
      } else {
        alert("Lỗi khi xóa bài viết. Vui lòng thử lại.");
      }
    }
  };

  const handleEdit = (id: number | string) => {
    router.push(`/blog/create?id=${id}`);
  };

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
              <PostItem
                key={p.id}
                post={p}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
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
              <PostItem
                key={p.id}
                post={p}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
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
