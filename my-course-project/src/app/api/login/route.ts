import { NextResponse } from "next/server";
import { users } from "@/app/data/users";
import bcrypt from "bcryptjs"; // Import bcryptjs

interface User {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { mess: "Vui lòng nhập email và mật khẩu" },
      { status: 400 }
    );
  }

  const user = (users as User[]).find((u: User) => u.email === email);
  if (!user) {
    return NextResponse.json(
      { mess: "Email chưa được đăng ký" },
      { status: 400 }
    );
  }

  // Compare the provided password with the hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ mess: "Mật khẩu không đúng" }, { status: 400 });
  }

  return NextResponse.json(
    { mess: "Đăng nhập thành công!", user },
    { status: 200 }
  );
}
