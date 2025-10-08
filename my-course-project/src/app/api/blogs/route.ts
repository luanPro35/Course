import { NextResponse } from "next/server";
import { BlogPost } from "@/types/blog.types";

const blogPosts: BlogPost[] = [];
export async function GET() {
  return NextResponse.json(blogPosts);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || !data.title) {
      return NextResponse.json(
        {
          error: "Thiếu tiêu đề nội dung",
        },
        {
          status: 400,
        }
      );
    }

    const newPost: BlogPost = {
      id: Date.now(),
      author: data.author || "Ẩn danh",
      title: data.title,
      content: data.content,
      category: data.category || "Khác",
      image: data.image || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || "draft",
    };

    blogPosts.push(newPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any).message || "An error occurred" },
      { status: 500 }
    );
  }
}
