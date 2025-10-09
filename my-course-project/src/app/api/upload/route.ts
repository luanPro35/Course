import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File is not an image." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // *** THAY ĐỔI: Lưu vào public/images ***
    const uploadDir = path.join(process.cwd(), "public", "images");

    // Tạo tên tệp duy nhất để tránh ghi đè
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, filename);

    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await writeFile(filePath, buffer);

    // *** THAY ĐỔI: Trả về đường dẫn công khai tới /images ***
    const publicPath = `/images/${filename}`;

    return NextResponse.json({ success: true, path: publicPath });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
