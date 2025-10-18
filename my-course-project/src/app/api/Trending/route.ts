import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:3001/trending");
    if (!res.ok) {
      throw new Error("Failed to fetch trending posts");
    }
    const trendingPosts = await res.json();
    return NextResponse.json(trendingPosts);
  } catch (error) {
    console.error("Error in trending route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
