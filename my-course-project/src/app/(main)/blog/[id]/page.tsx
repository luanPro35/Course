"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types/blog.types";
import Image from "next/image";
import { getPublishedArticlesURL } from "@/services/api.service";
import { BlogService } from "@/services/blog.service";
import { useAuth } from "@/hooks/useAuth";

const BlogPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        if (user?.id) {
          try {
            const myPost = await BlogService.getById(Number(id));
            if (myPost) {
              setPost(myPost);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.log("Not user's post, trying public posts...");
          }
        }

        let page = 0;
        const size = 10;
        let found = null;
        while (!found && page < 100) {
          
          const res = await fetch(getPublishedArticlesURL(page, size), {
            cache: "no-store",
          });
          if (!res.ok) {
            setError("Không thể tải được bài viết.");
            return;
          }
          const data = await res.json();
          const container = data?.result ?? data?.data ?? data;
          const list = container?.content || [];
          found = list.find((item: BlogPost) => String(item.id) === String(id));
          if (found) {
            const mapped: BlogPost = {
              id: found.id,
              author: found.author,
              title: found.title,
              content: found.fullContent || found.content,
              fullContent: found.fullContent,
              category: found.category,
              image: found.thumbnailUrl || found.image,
              status: found.statusPost || found.status,
              createdAt:
                found.createdAt ||
                found.created_date ||
                found.createdDate ||
                found.updatedAt,
              updatedAt: found.updatedAt,
              user: found.user, 
            };
            setPost(mapped);
            return;
          }
          if (!container?.last && !container?.hasNext) {
            break;
          }
          page++;
        }
        if (!found) {
          setError("Không tìm thấy bài viết.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Không thể tải được bài viết.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user?.id]);

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
              {post.user?.avatar ? (
                <Image
                  src={post.user.avatar}
                  alt={post.author || post.user?.fullName || "Avatar"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Image
                  src="/images/avatar.png"
                  alt={post.author || post.user?.fullName || "Avatar"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                {post.author || post.user?.fullName || ""}
              </h2>
              <div className="text-sm text-gray-500 mt-0.5">
                {(() => {
                  const d = post.createdAt ? new Date(post.createdAt) : null;
                  const ok = d && !isNaN(d.getTime());
                  return ok ? (
                    <span>{d!.toLocaleDateString("vi-VN")}</span>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </div>

        {}
        <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
          {post.title || "Tiêu đề bài viết"}
        </h1>
        {post.image && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
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
