"use client";
import React, { useEffect, useState } from "react";
import { Post } from "@/types/post";
import { BlogPost } from "@/types/blog.types";
import Image from "next/image";
import Loading from "../../../components/ui/Loading";
import { FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { getPublishedArticlesURL } from "@/services/api.service";
import { BlogService } from "@/services/blog.service";
import { useRouter } from "next/navigation";

const POSTS_PER_PAGE = 5;

interface PostsProps {
  filterCategories?: string[]; // Nhận categories để lọc
}

interface ApiPostItem {
  id: number | string;
  author: string;
  title: string;
  content: string;
  fullContent?: string;
  category: string;
  thumbnailUrl?: string;
  image?: string;
  createdAt: string;
  timeAgo: string;
  readTime: string;
}

export default function Posts({ filterCategories }: PostsProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(getPublishedArticlesURL(currentPage - 1, POSTS_PER_PAGE))
      .then((res) => res.json())
      .then((data) => {
        const container = (data && (data.result || data.data)) || data;
        const list = Array.isArray(container?.content)
          ? container.content
          : Array.isArray(container)
          ? container
          : [];
        const normalized = list.map((item: ApiPostItem) => ({
          id: String(item.id),
          author: item.author,
          title: item.title,
          content: item.content,
          fullContent: item.fullContent,
          category: item.category,
          image: item.thumbnailUrl || item.image,
          createdAt: item.createdAt,
          timeAgo: item.timeAgo,
          readTime: item.readTime,
        }));
        setPosts(normalized as Post[]);
        setTotalPages(
          Number(container?.totalPages) || Number(data?.totalPages) || 0
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const displayedPosts =
    !filterCategories || filterCategories.length === 0
      ? posts
      : posts.filter((post) => filterCategories.includes(post.category));

  const handleNavigate = (postId: string) => {
    router.push(`/blog/${postId}`);
  };

  return (
    <div className="max-w-5xl pl-13">
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-8">
          Bài viết nổi bật
        </h1>
        <p className="text-gray-700">
          Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online
          và các kỹ thuật lập trình web.
        </p>
        {filterCategories && filterCategories.length > 0 && (
          <p className="text-sm text-blue-600 mt-2">
            Đang hiển thị {displayedPosts.length} bài viết được lọc trên trang
            này
          </p>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : displayedPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Không tìm thấy bài viết nào
        </div>
      ) : (
        displayedPosts.map((post) => {
          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow min-h-64 cursor-pointer"
              onClick={() => handleNavigate(post.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-800">{post.author}</span>
              </div>

              <div className="flex md:flex-row flex-col gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="md:flex-shrink-0 flex-shrink">
                  <div className="relative md:w-52 w-full md:h-36 h-48 rounded-xl overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`mx-1 px-3 py-1 rounded-md ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
