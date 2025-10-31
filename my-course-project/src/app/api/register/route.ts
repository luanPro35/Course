import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { email, password, name, phone } = formData;

    if (!email || !password || !name) {
      return NextResponse.json(
        { mess: "Tên, email và mật khẩu là bắt buộc", success: false },
        { status: 400 }
      );
    }

    // Check if email already exists in json-server
    const userExistsResponse = await fetch(
      `http://localhost:3001/users?email=${encodeURIComponent(email)}`
    );
    const existingUsers = await userExistsResponse.json();

    // Check if any user has the exact same email (case-insensitive)
    const emailExists = existingUsers.some(
      (user: { email: string }) =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      console.log("Email already exists:", email);
      return NextResponse.json(
        { mess: "Email đã được sử dụng", success: false },
        { status: 409 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = {
      id: Date.now().toString(), // Generate a string ID
      name: name,
      fullName: name,
      email,
      phone: phone || "",
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
      throw new Error("Không thể đăng ký người dùng trên máy chủ JSON.");
    }

    const createdUser = await createUserResponse.json();

    // Remove password from the returned user object for security
    const { password: _password, ...userWithoutPassword } = createdUser;

    return NextResponse.json(
      { mess: "Đăng ký thành công!", success: true, user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { mess: "Lỗi máy chủ nội bộ", success: false },
      { status: 500 }
    );
  }
}
