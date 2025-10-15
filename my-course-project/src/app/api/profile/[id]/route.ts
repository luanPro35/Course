import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { User } from "@/types/user";

const informationsFilePath = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "information.json"
);

function readInformations(): User[] {
  try {
    const data = fs.readFileSync(informationsFilePath, "utf-8");
    return JSON.parse(data) as User[];
  } catch (error) {
    return [];
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Thiếu ID người dùng" },
        { status: 400 }
      );
    }

    const informations = readInformations();
    const user = informations.find((user) => user.id === userId);

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy hồ sơ:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
