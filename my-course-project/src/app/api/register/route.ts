// ... existing code ...
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/types/user";

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

    // Check if email already exists in json-server
    const userExistsResponse = await fetch(
      `http://localhost:3001/users?email=${email}`
    );
    const existingUsers = await userExistsResponse.json();

    if (existingUsers.length > 0) {
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

    // Create new user object for json-server
    const newUser = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // POST new user to json-server
    const createUserResponse = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!createUserResponse.ok) {
      throw new Error("Không thể tạo người dùng trên máy chủ JSON.");
    }

    const createdUser = await createUserResponse.json();

    // Remove password from the returned user object
    const { password: _password, ...userWithoutPassword } = createdUser;

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
  // Fetch users from json-server
  const res = await fetch("http://localhost:3001/users");
  const users = await res.json();
  // Return users without their passwords
  const usersWithoutPasswords = users.map((user: User) => {
    const { password, ...rest } = user;
    return rest;
  });
  return NextResponse.json(usersWithoutPasswords);
}
