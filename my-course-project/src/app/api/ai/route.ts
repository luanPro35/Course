import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const content = searchParams.get("content");

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const backendUrl = "http://127.0.0.1:8080/project/ai";
    const body = new URLSearchParams();
    body.append("content", content);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    const responseData = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: `Error from backend: ${response.statusText}`,
          details: responseData,
        },
        { status: response.status }
      );
    }

    return new NextResponse(responseData, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error in proxy API route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}
