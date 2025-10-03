import { NextResponse } from "next/server";

let users = [];
export async function POST(req) {
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

  if (users.find((u) => u.email === email)) {
    return NextResponse.json(
      { mess: "Email đã được đăng kí" },
      { status: 400 }
    );
  }

  const newUser = { id: Date.now().toString(), fullName, email, phone };
  users.push(newUser);
  return NextResponse.json(
    { message: "Đăng ký thành công!", user: newUser },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json(users);
}
