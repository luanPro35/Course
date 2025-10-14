import { NextRequest, NextResponse } from "next/server";
import { Information } from "@/types/information.types";
import fs from "fs";
import path from "path";

const personalFilePath = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "information.json"
);

const readPersonalFromFile = (): Information[] => {
  try {
    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(personalFilePath)) {
      // Nếu không tồn tại, tạo file mới với mảng rỗng
      fs.writeFileSync(personalFilePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    
    const fileContent = fs.readFileSync(personalFilePath, "utf-8");
    // Nếu file rỗng, trả về mảng rỗng
    if (!fileContent.trim()) {
      return [];
    }
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Lỗi khi đọc từ tệp information.json:", error);
    return [];
  }
};

const savePersonalToFile = (personal: Information[]) => {
  try {
    fs.writeFileSync(
      personalFilePath,
      JSON.stringify(personal, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Lỗi khi ghi vào tệp information.json:", error);
    throw new Error("Không thể lưu dữ liệu");
  }
};

export async function GET() {
  const personal: Information[] = readPersonalFromFile();
  return NextResponse.json(personal);
}

// API POST để lưu thông tin cá nhân mới
export async function POST(request: NextRequest) {
  try {
    // Lấy dữ liệu từ request
    const newInformation: Information = await request.json();
    
    // Đọc dữ liệu hiện tại
    const informations = readPersonalFromFile();
    
    // Thêm thông tin mới vào mảng
    informations.push(newInformation);
    
    // Lưu lại vào file
    savePersonalToFile(informations);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Lưu thông tin cá nhân thành công",
        data: newInformation
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi lưu thông tin cá nhân:", error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : "Lỗi khi lưu thông tin cá nhân" 
      },
      { status: 500 }
    );
  }
}
