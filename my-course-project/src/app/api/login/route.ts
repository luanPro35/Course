import { NextResponse } from "next/server";
import { USER_API_URL } from "@/services/api.service";



export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    
    const beResponse = await fetch(`${USER_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log("Calling Java API:", `${USER_API_URL}/auth/login`);

    const data = await beResponse.json();

    
    if (!beResponse.ok) {
      return NextResponse.json(
        { mess: data.message || "Email hoặc mật khẩu không đúng!" },
        { status: beResponse.status }
      );
    }



    
    
    
    const userData = {
      ...data.data.user,
      
      roles: data.data.user?.roles || data.data.user?.role ? [data.data.user.role] : [],
      role: data.data.user?.roles?.[0]?.name || data.data.user?.role || null,
    };



    return NextResponse.json(
      {
        mess: data.message, 
        user: userData,
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
