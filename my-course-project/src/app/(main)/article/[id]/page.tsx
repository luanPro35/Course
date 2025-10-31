"use client";

import React from "react";
import type { Post, LinkPost } from "@/types/post";
import { linkPosts } from "@/app/(main)/article/page";
import Image from "next/image";

// Helper functions
export const getPostsByGroup = (
  articles: Post[],
  groupLink: string
): Post[] => {
  const group = linkPosts.find(
    (link: { id: number; title: string; categories: string[] }) =>
      link.title === groupLink
  );

  if (!group) return [];

  return articles.filter((article) =>
    group.categories.includes(article.category)
  );
};

// Hàm lọc bài viết theo category cụ thể
export const getPostsByCategory = (
  articles: Post[],
  category: string
): Post[] => {
  return articles.filter((article) => article.category === category);
};

// Hàm lấy tất cả categories unique
export const getAllCategories = (articles: Post[]): string[] => {
  const categories = articles.map((article) => article.category);
  return [...new Set(categories)].filter((cat) => cat !== "");
};

// Component example usage
export const ArticleList = ({
  articles,
  groupLink,
}: {
  articles: Post[];
  groupLink: string;
}) => {
  const filteredPosts = getPostsByGroup(articles, groupLink);

  return (
    <div>
      <h2>
        {
          linkPosts.find(
            (link: { id: number; title: string; categories: string[] }) =>
              link.title === groupLink
          )?.title
        }
      </h2>
      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <Image src={post.image} alt={post.title} width={300} height={200} />
            <span className="category">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="meta">
              <span>{post.author}</span>
              <span>{post.timeAgo}</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Page component
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
      <ArticleList articles={[]} groupLink={id} />
    </div>
  );
}
