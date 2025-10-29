"use client";

import React from "react";
import type { Post } from "@/types/post"; // Assuming Post is also in types/post
import { linkPosts } from "@/types/post"; // Corrected path

// Helper functions
export const getPostsByGroup = (
  articles: Post[],
  groupLink: string
): Post[] => {
  const group = linkPosts.find((link) => link.link === groupLink);

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
      <h2>{linkPosts.find((link) => link.link === groupLink)?.title}</h2>
      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.image} alt={post.title} />
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
export default function Page() {
  // The Page component itself is not defined in the provided snippet.
  // For now, I'll leave it empty as the task is to fix the provided code.
  // If it's meant to render ArticleList, that would be added here.
  return (
    <div>
      {/* Example: Render ArticleList if needed */}
      {/* <ArticleList articles={[]} groupLink="some-link" /> */}
    </div>
  );
}
