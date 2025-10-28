import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DbData } from "../../../types/db";
import { User } from "@/types/user";
import { CourseFree } from "@/types/courseFree";
const dbPath = path.resolve(process.cwd(), "db.json");

export async function POST(req: NextRequest) {
  try {
    const { userId, course }: { userId: string; course: CourseFree } =
      await req.json();

    if (!userId || !course) {
      return NextResponse.json(
        { message: "Missing userId or course data" },
        { status: 400 }
      );
    }

    const dbData: DbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    const userIndex = dbData.users.findIndex(
      (user: User) => user.id === userId
    );

    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!dbData.users[userIndex].courses) {
      dbData.users[userIndex].courses = [];
    }

    const courseExists = dbData.coursesFree.some(
      (c: CourseFree) => c.id.toString() === course.id.toString()
    );

    if (!courseExists) {
      return NextResponse.json(
        { message: "Course not found in database" },
        { status: 404 }
      );
    }

    const isCourseAlreadyRegistered = dbData.users[userIndex].courses!.some(
      (c: CourseFree) => c.id === course.id
    );

    console.log("isCourseAlreadyRegistered:", isCourseAlreadyRegistered);
    console.log("Before push, courses:", dbData.users[userIndex].courses);

    if (isCourseAlreadyRegistered) {
      console.log("Course already registered, returning 409");
      return NextResponse.json(
        { message: "Course already registered" },
        { status: 409 }
      );
    } else {
      dbData.users[userIndex].courses!.push(course); // Push to user's courses array
      console.log("Course registered successfully");
    }

    console.log("After push, courses:", dbData.users[userIndex].courses);
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    return NextResponse.json(
      { message: "Course registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId parameter" },
        { status: 400 }
      );
    }

    let dbData: DbData;
    try {
      const fileContent = fs.readFileSync(dbPath, "utf-8");
      dbData = JSON.parse(fileContent);
    } catch (parseError) {
      console.error("Error parsing db.json:", parseError);
      return NextResponse.json(
        { message: "Error reading or parsing database" },
        { status: 500 }
      );
    }

    const user = dbData.users.find((user: User) => user.id === userId);

    if (!user) {
      console.warn(`User with ID ${userId} not found in db.json`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Unhandled error in GET /api/my-courses:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
