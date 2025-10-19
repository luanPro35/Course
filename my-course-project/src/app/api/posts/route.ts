import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Unified interfaces
interface Post {
  id: number;
  author?: string;
  title?: string;
  content?: string;
  category?: string;
  timeAgo?: string;
  readTime?: string;
  image?: string;
}

interface Db {
  posts: Post[];
}

// Unified DB helpers
const dbPath = path.join(process.cwd(), "db.json");

const readDb = (): Db => {
  try {
    // Check if db.json exists before reading
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf8");
      // Handle empty file case
      if (data) {
        return JSON.parse(data);
      }
    }
    // If file doesn't exist or is empty, return a default structure
    return { posts: [] };
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { posts: [] };
  }
};

const writeDb = (data: Db): boolean => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing to db.json:", error);
    return false;
  }
};

// Combined GET handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const db = readDb();
    if (id) {
      // Get single post by ID
      const post = db.posts.find((p) => p.id.toString() === id);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    } else {
      // Get all posts
      return NextResponse.json(db.posts);
    }
  } catch (error) {
    console.error("Error in GET method:", error);
    return NextResponse.json(
      { error: "Không thể tải bài viết" },
      { status: 500 }
    );
  }
}

// POST handler to create a new post
export async function POST(request: Request) {
  try {
    const postData = await request.json();
    const db = readDb();

    if (!db.posts) {
      db.posts = [];
    }

    const newPost: Post = {
      id: Date.now(),
      ...postData,
      createdAt: new Date().toISOString(), // More standard field name
      updatedAt: new Date().toISOString(),
    };

    db.posts.unshift(newPost);

    if (writeDb(db)) {
      return NextResponse.json(newPost, { status: 201 });
    } else {
      return NextResponse.json(
        { error: "Không thể lưu bài viết mới" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST method:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo bài viết" },
      { status: 500 }
    );
  }
}

// PUT handler to update a post
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const db = readDb();

    const postIndex = db.posts.findIndex((p) => p.id.toString() === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    db.posts[postIndex] = {
      ...db.posts[postIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    if (writeDb(db)) {
      return NextResponse.json(db.posts[postIndex]);
    } else {
      return NextResponse.json(
        { error: "Không thể cập nhật bài viết" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a post
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const db = readDb();
    const postIndex = db.posts.findIndex((p) => p.id.toString() === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const deletedPost = db.posts[postIndex];
    db.posts.splice(postIndex, 1);

    if (writeDb(db)) {
      return NextResponse.json({
        success: true,
        message: "Xóa bài viết thành công",
        deletedPost,
      });
    } else {
      return NextResponse.json(
        { error: "Không thể xóa bài viết" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
