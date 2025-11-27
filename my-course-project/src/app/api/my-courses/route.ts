import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types/user";
import { CourseFree } from "@/types/courseFree";


const BACKEND_API_URL = "http://localhost:8080/project";
const FREE_COURSES_API = `${BACKEND_API_URL}/courses/published?page=0&size=100&sort=createdAt,desc`;
const USER_API = `${BACKEND_API_URL}/users`;

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const { courseId } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "Missing userId or courseId" },
        { status: 400 }
      );
    }

    
    const userRes = await fetch(`${USER_API}/${userId}`);
    if (!userRes.ok) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user: User = await userRes.json();

    
    const courseRes = await fetch(`${FREE_COURSES_API}/${courseId}`);
    if (!courseRes.ok) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }
    const course: CourseFree = await courseRes.json();

    
    const userCoursesRes = await fetch(`${USER_API}/${userId}/courses`);
    if (userCoursesRes.ok) {
      const userCourses: CourseFree[] = await userCoursesRes.json();
      const isCourseAlreadyRegistered = userCourses.some(
        (c: CourseFree) => c.id === courseId
      );

      if (isCourseAlreadyRegistered) {
        return NextResponse.json(
          { message: "Course already registered" },
          { status: 409 }
        );
      }
    }

    
    const registerRes = await fetch(`${USER_API}/${userId}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    if (!registerRes.ok) {
      throw new Error("Failed to register course");
    }

    return NextResponse.json(
      { message: "Course registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering course:", error);
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

    
    const userRes = await fetch(`${USER_API}/${userId}`);
    if (!userRes.ok) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user: User = await userRes.json();
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}