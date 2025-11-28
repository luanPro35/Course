import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CardTrending } from "@/types/trending";
import Loading from "@/components/ui/Loading";
import { getCourses } from "@/services/postTrending.service";

export default function CourseTrending() {
  const [postTrending, setPostTrending] = useState<CardTrending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const data = await getCourses();
        setPostTrending(data);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
        setPostTrending([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {postTrending.map((trending) => (
        <div
          key={trending.id}
          className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
          {}
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={trending.image}
              alt={trending.title}
              width={400}
              height={240}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {}
          <div className="p-5">
            {}
            <h3 className="font-semibold text-gray-900 text-lg mb-4 line-clamp-2 min-h-[3.5rem]">
              {trending.title}
            </h3>

            {}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              {}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {trending.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {trending.author}
                </span>
              </div>

              {}
              <span className="text-sm text-gray-500">
                {trending.time_posts}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
