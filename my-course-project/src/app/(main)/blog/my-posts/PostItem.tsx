"use client";
import { useState, useRef, useEffect } from "react";
import { BlogPost } from "@/types/blog.types";
import Image from "next/image";
import { FiMoreHorizontal } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface PostItemProps {
  post: BlogPost;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
}

export const PostItem = ({ post, handleDelete, handleEdit }: PostItemProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-gray-800">{post.author}</span>
        {post.status === "draft" && (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <FiMoreHorizontal color="gray" size={24} />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuVariants}
                  className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10"
                >
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      handleEdit(post.id);
                      setOpen(false);
                    }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={() => {
                      handleDelete(post.id);
                      setOpen(false);
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Nội dung chính */}
      <div className="flex gap-6">
        {/* Text bên trái */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">
            {post.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
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
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
};
