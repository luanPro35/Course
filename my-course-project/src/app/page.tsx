"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseLandingPage from "@/components/ui/Slider";
import Sidebar from "@/components/layout/Sidebar";
import CoursePro from "@/app/courses/pro/CoursePro";
import CourseFree from "./courses/free/CourseFree";
import CourseTrending from "./articles/[id]/Trending";
import FeaturedVideos from "./video/[id]/FeaturedVideos";
import { CoursePro as CourseProType } from "@/types/coursePro";
import { getCourses as getProCourses } from "@/services/coursesPro.service";
import Chatbot from "./(main)/chatbot/page";
interface SectionHeaderProps {
  title: string;
  showNewBadge?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showNewBadge = false,
}) => (
  <div className="flex items-center gap-3">
    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      {title}
    </h2>
    {showNewBadge && (
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25" />
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg shadow-lg transform -translate-y-2 hover:scale-105 transition-all duration-300">
          <span className="text-white text-sm font-bold tracking-wide">
            MỚI
          </span>
        </div>
      </div>
    )}
  </div>
);

interface ContentSectionProps {
  title: string;
  showNewBadge?: boolean;
  children: React.ReactNode;
  link?: React.ReactNode;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  showNewBadge,
  children,
  link,
}) => (
  <section className="pt-14 px-4 md:px-6">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <SectionHeader title={title} showNewBadge={showNewBadge} />
      {link && <div className="mt-4 md:mt-0">{link}</div>}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
      {children}
    </div>
  </section>
);

export default function Home() {
  const [proCourses, setProCourses] = useState<CourseProType[]>([]);

  useEffect(() => {
    const fetchProCourses = async () => {
      try {
        const data = await getProCourses();
        setProCourses(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch pro courses:", error);
      }
    };

    fetchProCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>

      <div className="flex flex-1 pt-16">
        <aside className="w-28 flex-shrink-0 hidden lg:block">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        <main className="flex-1 px-4 md:px-6 lg:px-12 py-8 pt-8">
          <CourseLandingPage />

          <ContentSection title="Khóa học Pro" showNewBadge>
            {proCourses.map((course) => (
              <CoursePro key={course.id} course={course} />
            ))}
          </ContentSection>

          <ContentSection
            title="Khóa học miễn phí"
            link={
              <Link
                href="/route"
                className="font-bold text-2xl text-orange-500 hover:text-orange-700 transition-colors duration-300"
              >
                Xem lộ trình →
              </Link>
            }
          >
            <CourseFree />
          </ContentSection>

          <ContentSection
            title="Bài viết nổi bật"
            link={
              <Link
                href="/article"
                className="font-bold text-2xl text-orange-500 hover:text-orange-700 transition-colors duration-300"
              >
                Xem tất cả →
              </Link>
            }
          >
            <CourseTrending />
          </ContentSection>

          <ContentSection title="Videos nổi bật">
            <FeaturedVideos />
          </ContentSection>
        </main>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>

      <Footer />
    </div>
  );
}
