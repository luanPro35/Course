"use client";
import React, { useEffect, useState } from "react";
import { Post } from "@/types/post";
import Image from "next/image";
import Loading from "../../../components/ui/Loading";
import { FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { SavedService } from "@/services/saved.service";

const POSTS_PER_PAGE = 10;

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch("api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      const saved = await SavedService.getAll();
      setSavedPosts(saved.map((p) => p.id));
    } catch (err) {
      console.error("Lỗi khi tải saved:", err);
    }
  };

  const handleToggle = async (post: Post) => {
    try {
      if (savedPosts.includes(post.id)) {
        await SavedService.delete(post.id);
        setSavedPosts(savedPosts.filter((id) => id !== post.id));
      } else {
        // Ensure the object sent to the save service matches the BlogPost type
        const blogPostToSave = {
          id: post.id,
          title: post.title,
          content: post.content,
          author: post.author,
          category: post.category,
          image: post.image,
          createdAt: new Date().toISOString(), // Assuming you want to set the creation date on save
        };
        await SavedService.save(blogPostToSave);
        setSavedPosts([...savedPosts, post.id]);
      }
    } catch (err) {
      console.error("Lỗi khi lưu/bỏ lưu bài viết:", err);
    }
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

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
      </div>

      {loading ? (
        <Loading />
      ) : (
        currentPosts.map((post) => {
          const isSaved = savedPosts.includes(post.id);
          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow min-h-64"
            >
              {/* Header với tên tác giả */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-800">{post.author}</span>
                <button
                  onClick={() => handleToggle(post)}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors cursor-pointer"
                >
                  {isSaved ? (
                    <FaBookmark size={20} color="orange" />
                  ) : (
                    <FiBookmark size={20} color="gray" />
                  )}
                </button>
              </div>

              {/* Nội dung chính */}
              <div className="flex gap-6">
                {/* Text bên trái */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Tags và thông tin */}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Hình ảnh bên phải */}
                <div className="flex-shrink-0">
                  <div className="relative w-52 h-36 rounded-xl overflow-hidden">
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
    </div>
  );
}
