import { NextResponse } from "next/server";
import { USER_API_URL } from "@/services/api.service";

// Lấy URL của Backend Java từ biến môi trường

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Gọi thẳng đến API login của Backend Java
    const beResponse = await fetch(`${USER_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log("Calling Java API:", `${USER_API_URL}/auth/login`);

    const data = await beResponse.json();

    // Nếu Backend Java trả về lỗi (ví dụ 401 Unauthorized)
    if (!beResponse.ok) {
      return NextResponse.json(
        { mess: data.message || "Email hoặc mật khẩu không đúng!" },
        { status: beResponse.status }
      );
    }

    // Nếu thành công, trả về phần `result` từ Backend Java cho Frontend
    // BE Java trả về { data: { user: {...}, token: { accessToken, refreshToken } }, message: "..." }
    return NextResponse.json(
      {
        mess: data.message, // Lấy message từ response của BE
        user: data.data.user,
        accessToken: data.data.token.accessToken,
        refreshToken: data.data.token.refreshToken,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);
    let mess = "Không thể kết nối đến máy chủ xác thực";
    if (
      (error as { cause?: { code?: string } }).cause?.code === "ECONNREFUSED"
    ) {
      mess =
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra xem máy chủ đã chạy chưa.";
    }
    return NextResponse.json({ mess: mess }, { status: 500 });
  }
}
