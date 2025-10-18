import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { User } from "@/types/user";

const informationsFilePath = path.join(process.cwd(), "db.json");

function readInformations(): User[] {
  try {
    const data = fs.readFileSync(informationsFilePath, "utf-8");
    return (JSON.parse(data)?.users as User[]) || [];
  } catch (error) {
    return [];
  }
}

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Thiếu ID người dùng" },
        { status: 400 }
      );
    }

    const informations = readInformations();
    const user = informations.find(
      (user) => user.id && user.id.toString() === id
    );

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

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const updatedData = (await req.json()) as User;

    if (!id) {
      return NextResponse.json(
        { message: "Thiếu ID người dùng" },
        { status: 400 }
      );
    }

    const informations = readInformations();
    const userIndex = informations.findIndex(
      (user) => user.id && user.id.toString() === id
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    informations[userIndex] = { ...informations[userIndex], ...updatedData };

    fs.writeFileSync(
      informationsFilePath,
      JSON.stringify({ users: informations }, null, 2)
    );

    return NextResponse.json(
      { success: true, data: informations[userIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật hồ sơ:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
