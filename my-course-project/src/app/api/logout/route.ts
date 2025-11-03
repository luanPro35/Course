import { NextResponse } from "next/server";
import { USER_API_URL } from "@/services/api.service";

const JAVA_API_BASE_URL = USER_API_URL;

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { mess: "Access token is required" },
        { status: 400 }
      );
    }

    // Gọi đến API logout của Backend Java để vô hiệu hóa token
    await fetch(`${JAVA_API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Thêm accessToken vào header để xác thực request
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ accessToken }),
    });

    // Không quan trọng kết quả trả về, chỉ cần trả về 200 để FE biết đã xử lý
    return NextResponse.json({ mess: "Logged out successfully" });
  } catch (error) {
    console.error("Logout API route error:", error);
    return NextResponse.json({ mess: "Internal Server Error" }, { status: 500 });
  }
}