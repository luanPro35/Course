"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types/blog.types";
import Image from "next/image";
import { getPostByIdURL } from "@/services/api.service";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(getPostByIdURL(String(id)), { cache: "no-store" });
        const data = await res.json();
        const raw = data?.result ?? data?.data ?? data;
        if (!raw) {
          setError("Không tìm thấy bài viết.");
          return;
        }
        const mapped: BlogPost = {
          id: raw.id,
          author: raw.user?.fullName || raw.author,
          title: raw.title,
          content: raw.content,
          fullContent: raw.fullContent,
          category: raw.category,
          image: raw.thumbnailUrl || raw.image,
          status: raw.statusPost || raw.status,
          createdAt: raw.createdAt || raw.created_date || raw.createdDate || raw.updatedAt,
          updatedAt: raw.updatedAt,
          user: raw.user,
        };
        setPost(mapped);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Không thể tải được bài viết.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-20">Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto py-6 px-4 md:py-8 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.author || post.user?.fullName || "Ảnh bài viết"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Image
                  src="/images/avatar.png"
                  alt={post.author || post.user?.fullName || "Ảnh bài viết"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                {post.author || post.user?.fullName || "Ẩn danh"}
              </h2>
              <div className="text-sm text-gray-500 mt-0.5">
                {(() => {
                  const d = post.createdAt ? new Date(post.createdAt) : null;
                  const ok = d && !isNaN(d.getTime());
                  return ok ? <span>{d!.toLocaleDateString("vi-VN")}</span> : null;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
          {post.title}
        </h1>
        <div className="prose prose-base md:prose-lg lg:prose-xl max-w-none">
          <div
            className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl"
            dangerouslySetInnerHTML={{ __html: post.fullContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
