import { NextResponse, NextRequest } from "next/server";
import { User } from "@/types/user";

const BASE_URL = "http://localhost:8080/project/profile";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const authorization = request.headers.get("Authorization");

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    
    const response = await fetch(`${BASE_URL}?userId=${userId}`, {
      headers: {
        ...(authorization && { Authorization: authorization }),
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching the profile.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Partial<User> = await request.json();
    const authorization = request.headers.get("Authorization");

    
    const response = await fetch(`${BASE_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authorization && { Authorization: authorization }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the profile.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const authorization = request.headers.get("Authorization");

    
    const response = await fetch(`${BASE_URL}/update-avatar`, {
      method: "POST",
      headers: {
        ...(authorization && { Authorization: authorization }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the avatar.",
      },
      { status: 500 }
    );
  }
}
