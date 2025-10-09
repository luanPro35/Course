import { NextResponse } from "next/server";
import { BlogPost } from "@/types/blog.types";
import fs from "fs";
import path from "path";

// Đường dẫn đến tệp dữ liệu
const postsFilePath = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "posts.json"
);

// Hàm để đọc dữ liệu từ tệp
const readPostsFromFile = (): BlogPost[] => {
  try {
    const fileContent = fs.readFileSync(postsFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Lỗi khi đọc từ tệp posts.json:", error);
    return [];
  }
};

// Hàm để ghi dữ liệu vào tệp
const savePostsToFile = (posts: BlogPost[]) => {
  try {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), "utf-8");
  } catch (error) {
    console.error("Lỗi khi ghi vào tệp posts.json:", error);
  }
};

export async function GET() {
  const blogPosts: BlogPost[] = readPostsFromFile();
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

    const currentPosts = readPostsFromFile();
    currentPosts.push(newPost);
    savePostsToFile(currentPosts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any).message || "An error occurred" },
      { status: 500 }
    );
  }
}
