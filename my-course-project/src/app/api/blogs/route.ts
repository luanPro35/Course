import { NextResponse } from "next/server";
import { BlogPost } from "@/types/blog.types";
import { BLOG_BASE_URL } from "@/services/api.service";
export async function GET(req: Request) {
  const res = await fetch(BLOG_BASE_URL, { cache: "no-store" });
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

    const newPost: Omit<BlogPost, "id"> = {
      author: data.author || "Ẩn danh",
      title: data.title,
      content: data.content,
      category: data.category || "Khác",
      image: data.image || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || "draft",
      fullContent: data.fullContent || "",
    };

    const res = await fetch(BLOG_BASE_URL, {
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const res = await fetch(`${BLOG_BASE_URL}/${id}`, {
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

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const updatedPost: Partial<BlogPost> = await req.json();

    const res = await fetch(`${BLOG_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const returnedPost = await res.json();
    return NextResponse.json(returnedPost);
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any).message || "An error occurred" },
      { status: 500 }
    );
  }
}
