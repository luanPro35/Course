import { NextResponse } from "next/server";
import { BlogPost } from "@/types/blog.types";
export async function GET() {
  const res = await fetch("http://localhost:3001/posts", {
    cache: "no-store",
  });
  const blogPosts: BlogPost[] = await res.json();
  return NextResponse.json(blogPosts);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: "Thiếu tiêu đề hoặc nội dung" },
        { status: 400 }
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

    const res = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    const addedPost = await res.json();

    return NextResponse.json(addedPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any).message || "An error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const res = await fetch(`http://localhost:3001/posts/${id}`, {
      method: "DELETE",
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any).message || "An error occurred" },
      { status: 500 }
    );
  }
}
