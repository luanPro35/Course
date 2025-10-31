import React from "react";
import LinkPost from "next/link";
import type { Post } from "../../../types/post";

interface LinkPostsProps {
  prop: Post;
}
export default function LinkPosts({ prop }: LinkPostsProps) {
  return (
    <div
      key={prop.id}
      className="mb-2 bg-white text-black px-4 py-2 text-sm font-medium rounded-2xl border border-blue-500"
    >
      <LinkPost href={`/article/${prop.id}`}>{prop.title}</LinkPost>
    </div>
  );
}
