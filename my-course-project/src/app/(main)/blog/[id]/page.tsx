"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogService } from "@/services/blog.service";
import { BlogPost } from "@/types/blog.types";
import Image from "next/image";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          // Get all posts and find the one with matching ID
          const allPosts = await BlogService.getAll();
          const fetchedPost = allPosts.find(
            (p) => p.id.toString() === id.toString()
          );

          if (fetchedPost) {
            setPost(fetchedPost);
          } else {
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
    }
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
      <div className="max-w-3xl mx-auto py-8 px-6">
        {/* Author info and metadata */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={post.image}
                alt={post.user?.fullName || "Author"}
                layout="fill"
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                {post.user?.fullName || "Unknown Author"}
              </h2>
              <div className="text-sm text-gray-500 mt-0.5">
                <span>
                  {new Date(post.createdAt!).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
          {post.title}
        </h1>
        <div className="prose prose-3xl max-w-none">
          <div
            className="text-gray-700 leading-relaxed text-2xl"
            dangerouslySetInnerHTML={{ __html: post.fullContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
