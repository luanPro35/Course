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

function writeInformations(data: User[]) {
  fs.writeFileSync(informationsFilePath, JSON.stringify(data, null, 2));
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id: idString, ...userData } = body;
    const id = parseInt(idString, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID người dùng không hợp lệ" },
        { status: 400 }
      );
    }

    const informations = readInformations();
    const userIndex = informations.findIndex((user) => user.id === id);

    // Nếu không tìm thấy user, tạo mới
    if (userIndex === -1) {
      const newUser: User = {
        id,
        fullName: userData.fullName || "",
        avatar: userData.avatar || "",
        about: userData.about || "",
        personalWebsite: userData.personalWebsite || "",
        github: userData.github || "",
        linkedin: userData.linkedin || "",
        facebook: userData.facebook || "",
        youtube: userData.youtube || "",
        email: userData.email || "", // Add default or provided email
        phone: userData.phone || "", // Add default or provided phone
        createdAt: new Date(), // Add current timestamp
        updatedAt: new Date(), // Add current timestamp
      };

      informations.push(newUser);
      writeInformations(informations);

      return NextResponse.json(
        { message: "Tạo hồ sơ thành công", data: newUser },
        { status: 201 }
      );
    }

    // Cập nhật user hiện có
    const updatedUser: User = {
      ...informations[userIndex],
      ...userData,
      id, // Đảm bảo id không bị thay đổi
    };

    informations[userIndex] = updatedUser;
    writeInformations(informations);

    return NextResponse.json(
      { message: "Cập nhật hồ sơ thành công", data: updatedUser },
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
