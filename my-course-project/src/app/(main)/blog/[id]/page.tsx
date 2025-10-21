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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <div className="flex items-center mb-8 text-gray-500">
        <span>Tác giả: {post.author}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
      </div>
      <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
        <Image
          src={post.image}
          alt={post.title}
          layout="fill"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="prose lg:prose-xl max-w-none">{post.fullContent}</div>
    </div>
  );
};

export default BlogPostPage;
