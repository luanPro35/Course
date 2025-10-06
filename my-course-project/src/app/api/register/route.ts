import { NextResponse, NextRequest } from "next/server";
import { users } from "@/app/data/users";
import bcrypt from "bcryptjs";
import { User } from "@/types/user";
import fs from "fs";
import path from "path";

// Path to the users data file
const usersFilePath = path.join(process.cwd(), "src/app/data/users.ts");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email, password, confirmPassword } = body;

    // Basic validation
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ thông tin." },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Mật khẩu xác nhận không khớp." },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      return NextResponse.json(
        { message: "Email này đã được sử dụng." },
        { status: 409 }
      );
    }

    // Validate phone number format
    if (!/^0\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          message:
            "Số điện thoại không hợp lệ. Vui lòng sử dụng định dạng 10 chữ số bắt đầu bằng 0.",
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: Date.now(),
      fullName,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add user to the in-memory array
    users.push(newUser);

    // --- Persist users to file ---
    const fileContent = `import { User } from "../../types/user";\n\nexport const users: User[] = ${JSON.stringify(
      users,
      null,
      2
    )};\n`;

    try {
      fs.writeFileSync(usersFilePath, fileContent, "utf-8");
    } catch (writeError) {
      console.error("Failed to write to users file:", writeError);
      // In a real app, you might want to handle this more gracefully
      return NextResponse.json(
        {
          message: "Đăng ký thành công nhưng không thể lưu dữ liệu người dùng.",
        },
        { status: 500 }
      );
    }
    // -----------------------------

    // Remove password from the returned user object
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    return NextResponse.json(
      {
        message: "Đăng ký thành công!",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi phía máy chủ." },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return users without their passwords
  const usersWithoutPasswords = users.map(({ ...rest }) => rest);
  return NextResponse.json(usersWithoutPasswords);
}
