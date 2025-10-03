import { NextResponse, NextRequest } from "next/server";
import { users } from "@/app/data/users";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { fullName, phone, email, password, confirmPassword } = body;

  if (!fullName || !phone || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { mess: "Vui lòng nhập đủ thông tin" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { mess: "Mật khẩu xác định không xác định" },
      { status: 400 }
    );
  }

  if (users.find((u: User) => u.email === email)) {
    return NextResponse.json(
      { mess: "Email đã được đăng kí" },
      { status: 400 }
    );
  }

  if (!/^0\d{9}$/.test(phone)) {
    const msg = "Số điện thoại không hợp lệ! (phải đủ 10 số và bắt đầu bằng 0)";
    return NextResponse.json({ mess: msg }, { status: 400 });
  }

  const newUser: User = {
    id: Date.now().toString(),
    fullName,
    email,
    phone,
    password,
  };
  users.push(newUser);
  return NextResponse.json(
    { message: "Đăng ký thành công!", user: newUser },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json(users);
}
