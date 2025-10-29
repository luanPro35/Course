import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Admin login check (plaintext comparison for admin)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminUser = {
        id: 0,
        email: process.env.ADMIN_EMAIL,
        fullName: "Admin",
        role: "admin",
      };

      const token = jwt.sign(
        { id: adminUser.id, role: adminUser.role },
        process.env.JWT_SECRET! as string,
        {
          expiresIn: process.env.JWT_EXPIRES_IN! as string | number,
        } as SignOptions
      );

      return NextResponse.json({
        mess: "Đăng nhập quản trị viên thành công",
        token,
        user: adminUser,
      });
    }

    const userResponse = await fetch(
      `http://localhost:3001/users?email=${email}`
    );
    const users = await userResponse.json();
    const user = users[0];

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return NextResponse.json(
        { mess: "Email hoặc mật khẩu không đúng!" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, role: user.role || "user" },
      process.env.JWT_SECRET! as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN! as string | number,
      } as SignOptions
    );

    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json({
      mess: "Đăng nhập thành công",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ mess: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
