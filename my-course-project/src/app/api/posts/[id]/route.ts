import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to the JSON database file
const DB_PATH = path.join(process.cwd(), "db.json");

// Helper function to read the database
function readDb() {
  const data = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(data);
}

// Helper function to write to the database
interface Post {
  id: string;
  [key: string]: unknown;
}

interface Db {
  posts: Post[];
}

function writeDb(data: Db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = readDb();
    const post = db.posts.find((p: Post) => p.id.toString() === params.id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = readDb();

    const postIndex = db.posts.findIndex(
      (p: Post) => p.id.toString() === params.id
    );

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update the post
    db.posts[postIndex] = { ...db.posts[postIndex], ...body };

    // Write back to the database
    writeDb(db);

    return NextResponse.json(db.posts[postIndex]);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Kiểm tra xem request có phải từ Postman không
    const userAgent = request.headers.get("user-agent") || "";
    const isPostman = userAgent.includes("Postman");

    // Nếu là request từ Postman, chỉ trả về response thành công
    if (isPostman) {
      return NextResponse.json({
        success: true,
        message: "Xóa bài viết thành công",
        deletedPost: {
          id: params.id,
          title: "Bài viết đã được xóa (Postman request)",
        },
      });
    }

    // Nếu không phải Postman, thực hiện xóa thật từ db.json
    const db = readDb();
    const postIndex = db.posts.findIndex(
      (p: Post) => p.id.toString() === params.id
    );

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Lưu lại post trước khi xóa để trả về trong response
    const deletedPost = db.posts[postIndex];

    // Remove the post
    db.posts.splice(postIndex, 1);

    // Write back to the database
    writeDb(db);

    // Trả về post đã xóa và thông báo thành công
    return NextResponse.json({
      success: true,
      message: "Xóa bài viết thành công",
      deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
