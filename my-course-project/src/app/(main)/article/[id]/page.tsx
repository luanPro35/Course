import React from "react";
import type { PostDetail } from "@/types/post";

interface PostDetailProps {
  post: PostDetail;
}
export default function page({ post }: PostDetailProps) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
