import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types/user";
import { CourseFree } from "@/types/courseFree";
import { enrollFreeCourse, enrollCourse } from "@/services/api.service";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const { courseId, isFree } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "userId or courseId is required" },
        { status: 400 }
      );
    }

    if (isFree) {
      const res = await fetch(enrollFreeCourse + "/" + courseId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return NextResponse.json(
          { message: errorData.message || "Failed to enroll free course" },
          { status: res.status }
        );
      }

      const data = await res.json();
      return NextResponse.json(
        { message: "Successfully enrolled in free course", data },
        { status: 200 }
      );
    } else {
      const res = await fetch(enrollCourse, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          courseId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return NextResponse.json(
          { message: errorData.message || "Failed to enroll in course" },
          { status: res.status }
        );
      }

      const data = await res.json();
      return NextResponse.json(
        { message: "Successfully enrolled in course", data },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
