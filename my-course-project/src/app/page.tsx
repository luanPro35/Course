"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseLandingPage from "@/components/ui/Slider";
import Sidebar from "@/components/layout/Sidebar";
import CoursePro from "@/app/courses/[id]/CoursePro";
import CourseFree from "./courses/[id]/CourseFree";
import CourseTrending from "./articles/[id]/Trending";
import FeaturedVideos from "./video/[id]/FeaturedVideos";

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
  <section className="pt-14 px-6">
    <div className="flex items-center justify-between mb-6">
      <SectionHeader title={title} showNewBadge={showNewBadge} />
      {link && link}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
      {children}
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Navbar onLoginClick={() => {}} onRegisterClick={() => {}} />
      </header>

      <div className="flex flex-1 pt-16">
        <aside className="w-28 flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        <main className="flex-1 px-6 md:px-12 py-8 pt-8">
          <CourseLandingPage />

          <ContentSection title="Khóa học Pro" showNewBadge>
            <CoursePro />
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

      <Footer />
    </div>
  );
}
