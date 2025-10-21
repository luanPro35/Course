import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { User } from "@/types/user";

const jsonFilePath = path.join(process.cwd(), "db.json");

async function readData(): Promise<{ users: User[] }> {
  try {
    const fileContent = await fs.readFile(jsonFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading information.json:", error);
    return { users: [] };
  }
}

async function writeData(data: { users: User[] }): Promise<void> {
  await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const data = await readData();
    const user = data.users.find((u) => u.id === parseInt(userId, 10));

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching the profile.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body: Partial<User> = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required for update" },
        { status: 400 }
      );
    }

    const data = await readData();
    const userIndex = data.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = { ...data.users[userIndex], ...updateData };
    data.users[userIndex] = updatedUser;

    await writeData(data);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
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
