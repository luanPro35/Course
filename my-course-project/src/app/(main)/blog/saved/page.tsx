import Image from "next/image";
import { BlogPost } from "@/types/blog.types";
import postsData from "@/app/data/posts.json";
import { Calendar, Tag, User } from "lucide-react";

// Vì đây là Server Component, chúng ta có thể đọc dữ liệu trực tiếp
const posts: BlogPost[] = postsData as BlogPost[];

export default function AllPostsPage() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800">
          Tất cả bài viết
        </h1>

        <div className="space-y-12">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1"
            >
              {post.image && (
                <div className="relative w-full h-64 sm:h-80">
                  <Image
                    src={post.image}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
              )}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt || "").toLocaleDateString(
                        "vi-VN"
                      )}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h2>

                <p className="text-gray-700 leading-relaxed">{post.content}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
