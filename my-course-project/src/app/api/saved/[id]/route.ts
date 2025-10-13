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
    if (!fs.existsSync(savedFilePath)) return [];
    const fileContent = fs.readFileSync(savedFilePath, "utf-8");
    return fileContent ? JSON.parse(fileContent) : [];
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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    console.log(
      `--- BẮT ĐẦU YÊU CẦU DELETE cho /api/saved/${resolvedParams.id} ---`
    );
    const idFromUrl = resolvedParams.id;
    console.log(`ID từ URL (string): '${idFromUrl}'`);

    const idToDelete = Number(idFromUrl);
    console.log(`ID cần xóa (number): ${idToDelete}`);

    if (isNaN(idToDelete)) {
      console.log("Lỗi: ID không phải là số.");
      return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
    }

    const savedPosts = readSavedPostsFromFile();
    console.log(`Đã đọc ${savedPosts.length} bài viết từ file.`);
    console.log(
      "IDs trong file:",
      savedPosts.map((p) => `id: ${p.id} (type: ${typeof p.id})`)
    );

    const initialLength = savedPosts.length;
    if (initialLength === 0) {
      console.log("File không có bài viết nào. Không có gì để xóa.");
    }

    const postToFind = savedPosts.find((p) => Number(p.id) === idToDelete);
    console.log(
      "Kết quả tìm kiếm bài viết:",
      postToFind ? `Tìm thấy post id ${postToFind.id}` : "Không tìm thấy"
    );

    const newSavedPosts = savedPosts.filter((p) => Number(p.id) !== idToDelete);
    console.log(`Số bài viết sau khi lọc: ${newSavedPosts.length}`);

    if (newSavedPosts.length === initialLength) {
      console.log(
        "Lỗi: Không tìm thấy bài viết để xóa. Độ dài mảng không đổi."
      );
      console.log(`--- KẾT THÚC YÊU CẦU DELETE (LỖI 404) ---`);
      return NextResponse.json(
        { message: "Không tìm thấy bài viết để xóa" },
        { status: 404 }
      );
    }

    savePostsToFile(newSavedPosts);
    console.log("Xóa thành công. Đã ghi lại file.");
    console.log(`--- KẾT THÚC YÊU CẦU DELETE (THÀNH CÔNG) ---`);
    return NextResponse.json({ message: "Đã xóa bài viết đã lưu" });
  } catch (error) {
    console.error("Lỗi server nghiêm trọng khi xóa:", error);
    return NextResponse.json(
      { message: "Lỗi khi xử lý yêu cầu xóa" },
      { status: 500 }
    );
  }
}
