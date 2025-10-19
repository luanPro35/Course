import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  category: string;
  timeAgo: string;
  readTime: string;
  image: string;
}

interface Db {
  posts: Post[];
}

// Đường dẫn đến file db.json
const dbPath = path.join(process.cwd(), "db.json");

// Hàm đọc dữ liệu từ db.json
const readDbFile = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { posts: [] };
  }
};

// Hàm ghi dữ liệu vào db.json
const writeDbFile = (data: Db) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing to db.json:", error);
    return false;
  }
};

export async function GET() {
  try {
    const response = await fetch("http://localhost:3001/article");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in GET method:", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách bài viết" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Đọc nội dung request
    const postData = await request.json();

    // Đọc dữ liệu hiện tại từ db.json
    const db = readDbFile();

    // Đảm bảo có mảng posts
    if (!db.posts) {
      db.posts = [];
    }

    // Tạo ID mới cho bài viết
    const newId = Date.now();

    // Tạo bài viết mới với dữ liệu từ request
    const newPost = {
      id: newId,
      ...postData,
      updatedAt: new Date().toISOString(),
    };

    // Thêm bài viết mới vào mảng posts
    db.posts.unshift(newPost);

    // Lưu lại vào db.json
    const success = writeDbFile(db);

    if (success) {
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
