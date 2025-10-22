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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const fetchedPost = await BlogService.getById(id as string);
          setPost(fetchedPost);
        } catch (err) {
          setError("Không thể tải được bài viết.");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

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
                alt={post.author}
                layout="fill"
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                {post.author}
              </h2>
              <div className="text-sm text-gray-500 mt-0.5">
                <span>
                  {new Date(post.createdAt!).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className={`w-5 h-5 ${
                  liked ? "text-red-500" : "text-gray-400"
                }`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className={liked ? "text-red-500" : ""}>{likeCount}</span>
            </button>
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
