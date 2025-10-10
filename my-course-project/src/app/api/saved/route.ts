import { BlogPost } from "@/types/blog.types";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const savedFilePath = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "savedPosts.json"
);

const readSavedPostsFromFile = (): BlogPost[] => {
  try {
    if (!fs.existsSync(savedFilePath)) {
      fs.writeFileSync(savedFilePath, JSON.stringify([]));
      return [];
    }
    const fileContent = fs.readFileSync(savedFilePath, "utf-8");
    if (fileContent.trim() === "") {
      return [];
    }
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Lỗi khi đọc tệp savedPosts.json:", error);
    return [];
  }
};

const savePostsToFile = (posts: BlogPost[]) => {
  try {
    fs.writeFileSync(savedFilePath, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("Lỗi khi ghi vào tệp savedPosts.json:", error);
  }
};

export async function GET() {
  try {
    const savedPosts = readSavedPostsFromFile();
    return NextResponse.json(savedPosts);
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
    const savedPosts = readSavedPostsFromFile();

    // So sánh ID dưới dạng số để tránh lỗi kiểu dữ liệu
    const exists = savedPosts.find((p) => Number(p.id) === Number(post.id));
    if (!exists) {
      // Đảm bảo ID được lưu là một số
      post.id = Number(post.id);
      savedPosts.push(post);
      savePostsToFile(savedPosts);
    }

    return NextResponse.json({ message: "Đã lưu bài viết", data: post });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi khi lưu bài viết" },
      { status: 500 }
    );
  }
}

// The DELETE function has been moved to [id]/route.ts
// No DELETE function should be here.
