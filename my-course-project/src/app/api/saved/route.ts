import { BlogPost } from "@/types/blog.types";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbFilePath = path.join(process.cwd(), "db.json");

const readSavedPostsFromFile = (): { saved: BlogPost[] } => {
  try {
    if (!fs.existsSync(dbFilePath)) {
      // Initialize db.json with empty saved array if it doesn't exist
      const initialDb = { saved: [] };
      fs.writeFileSync(dbFilePath, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }

    const fileContent = fs.readFileSync(dbFilePath, "utf-8");
    if (!fileContent || fileContent.trim() === "") {
      return { saved: [] };
    }

    const db = JSON.parse(fileContent);
    // Ensure the saved array exists
    if (!db.saved) {
      db.saved = [];
    }

    return db;
  } catch (error) {
    console.error("Lỗi khi đọc tệp db.json:", error);
    return { saved: [] };
  }
};

const savePostsToFile = (db: { saved: BlogPost[] }) => {
  try {
    // Read the current db.json to preserve other data
    let currentDb = {};
    if (fs.existsSync(dbFilePath)) {
      const fileContent = fs.readFileSync(dbFilePath, "utf-8");
      if (fileContent && fileContent.trim() !== "") {
        currentDb = JSON.parse(fileContent);
      }
    }

    // Update only the saved array
    const updatedDb = { ...currentDb, saved: db.saved };
    fs.writeFileSync(dbFilePath, JSON.stringify(updatedDb, null, 2));
  } catch (error) {
    console.error("Lỗi khi ghi vào tệp db.json:", error);
  }
};

export async function GET() {
  try {
    const db = readSavedPostsFromFile();
    return NextResponse.json(db.saved || []);
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi khi tải danh sách đã lưu" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const post: BlogPost = await req.json();
    const db = readSavedPostsFromFile();
    const savedPosts = db.saved || [];

    // So sánh ID dưới dạng số để tránh lỗi kiểu dữ liệu
    const exists = savedPosts.find((p) => Number(p.id) === Number(post.id));
    if (!exists) {
      // Đảm bảo ID được lưu là một số
      post.id = Number(post.id);
      savedPosts.push(post);

      // Update the saved array in the db object
      db.saved = savedPosts;
      savePostsToFile(db);
    }

    return NextResponse.json({ message: "Đã lưu bài viết", data: post });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi khi lưu bài viết" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const idToDelete = Number(url.searchParams.get("id"));

    if (isNaN(idToDelete)) {
      return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
    }

    const db = readSavedPostsFromFile();
    const savedPosts = db.saved || [];

    const postIndex = savedPosts.findIndex((p) => Number(p.id) === idToDelete);

    if (postIndex === -1) {
      return NextResponse.json(
        { message: "Không tìm thấy bài viết để xóa" },
        { status: 404 }
      );
    }

    savedPosts.splice(postIndex, 1);
    db.saved = savedPosts;
    savePostsToFile(db);

    return NextResponse.json({ message: "Đã xóa bài viết đã lưu" });
  } catch (error) {
    console.error("Lỗi server nghiêm trọng khi xóa:", error);
    return NextResponse.json(
      { message: "Lỗi khi xử lý yêu cầu xóa" },
      { status: 500 }
    );
  }
}
