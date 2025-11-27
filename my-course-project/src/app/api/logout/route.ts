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

    
    await fetch(`${JAVA_API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ accessToken }),
    });

    
    return NextResponse.json({ mess: "Logged out successfully" });
  } catch (error) {
    console.error("Logout API route error:", error);
    return NextResponse.json({ mess: "Internal Server Error" }, { status: 500 });
  }
}