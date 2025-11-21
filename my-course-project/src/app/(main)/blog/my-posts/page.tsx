"use client";
import { useEffect, useState } from "react";
import { BlogService } from "@/services/blog.service"; // Force re-import
import { BlogPost } from "@/types/blog.types";
import { PostItem } from "./PostItem";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function MyPosts() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeContent, setActiveContent] = useState<"draft" | "published">(
    "draft"
  );

  const handleDelete = (id: number | string) => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để xóa bài viết");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      BlogService.delete(Number(id))
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
    if (!user?.id) {
      return;
    }

    BlogService.getAll()
      .then((allPosts) => {
        setPosts(allPosts);
      })
      .catch((err) => console.error(err));
  }, [user?.id]);

  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <div className="p-4 md:p-6 lg:ml-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 lg:mb-24">
        📝 Bài viết của tôi
      </h2>

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveContent("draft")}
          className={`px-3 sm:px-4 py-2 transition-all duration-200 text-base sm:text-lg ${
            activeContent === "draft"
              ? "text-black font-bold border-b-2 border-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Bản nháp ({drafts.length})
        </button>

        <button
          onClick={() => setActiveContent("published")}
          className={`px-3 sm:px-4 py-2 transition-all duration-200 text-base sm:text-lg ${
            activeContent === "published"
              ? "text-black font-bold border-b-2 border-black"
              : "text-gray-500 hover:text-black"
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
                avatar={user?.avatar}
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
                avatar={user?.avatar}
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
