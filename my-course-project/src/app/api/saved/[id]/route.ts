import { BlogPost } from "@/types/blog.types";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SAVED_API_URL } from "@/services/saved.service";
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
    if (!fileContent) return { saved: [] };
    
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
      if (fileContent) {
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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    console.log(
      `--- BẮT ĐẦU YÊU CẦU DELETE cho ${SAVED_API_URL}/${resolvedParams.id} ---`
    );
    const idFromUrl = resolvedParams.id;
    console.log(`ID từ URL (string): '${idFromUrl}'`);

    const idToDelete = Number(idFromUrl);
    console.log(`ID cần xóa (number): ${idToDelete}`);

    if (isNaN(idToDelete)) {
      console.log("Lỗi: ID không phải là số.");
      return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
    }

    const db = readSavedPostsFromFile();
    const savedPosts = db.saved || [];
    console.log(`Đã đọc ${savedPosts.length} bài viết từ file.`);
    console.log(
      "IDs trong file:",
      savedPosts.map((p) => `id: ${p.id} (type: ${typeof p.id})`)
    );

    const initialLength = savedPosts.length;
    if (initialLength === 0) {
      console.log("File không có bài viết nào. Không có gì để xóa.");
      return NextResponse.json(
        { message: "Không tìm thấy bài viết để xóa" },
        { status: 404 }
      );
    }

    // Hiển thị tất cả ID để debug
    console.log("Tất cả ID trong mảng saved:", savedPosts.map(p => `${p.id} (${typeof p.id})`).join(', '));
    
    // Tìm bài viết với ID chính xác
    const postToFind = savedPosts.find((p) => {
      const postId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
      return postId === idToDelete;
    });
    
    console.log(
      "Kết quả tìm kiếm bài viết:",
      postToFind ? `Tìm thấy post id ${postToFind.id}` : "Không tìm thấy"
    );

    if (!postToFind) {
      console.log("Lỗi: Không tìm thấy bài viết để xóa.");
      console.log(`--- KẾT THÚC YÊU CẦU DELETE (LỖI 404) ---`);
      return NextResponse.json(
        { message: "Không tìm thấy bài viết để xóa" },
        { status: 404 }
      );
    }

    // Lọc bài viết với ID chính xác
    const newSavedPosts = savedPosts.filter((p) => {
      const postId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
      return postId !== idToDelete;
    });
    console.log(`Số bài viết sau khi lọc: ${newSavedPosts.length}`);

    // Update the saved array in the db object
    db.saved = newSavedPosts;
    savePostsToFile(db);
    
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
