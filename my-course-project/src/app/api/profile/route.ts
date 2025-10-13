import { NextResponse } from "next/server";
import { users } from "@/app/data/users";
import { User } from "@/types/user";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, fullName, avatar } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Thiếu ID người dùng" },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    users[userIndex] = { ...users[userIndex], fullName, avatar };

    return NextResponse.json(
      { message: "Cập nhật hồ sơ thành công", user: users[userIndex] },
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
