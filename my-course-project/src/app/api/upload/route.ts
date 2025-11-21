import { NextResponse } from "next/server";
import { UPLOAD_IMAGE_POST_URL } from "@/services/api.service";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    // *** SỬA LỖI: Thay "avatar" thành "file" để khớp với client ***
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File is not an image." },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization") || "";
    const forwardForm = new FormData();
    forwardForm.append("file", file);

    const res = await fetch(UPLOAD_IMAGE_POST_URL, {
      method: "POST",
      headers: authHeader ? { Authorization: authHeader } : {},
      body: forwardForm,
    });

    const result = await res.json();

    if (!res.ok || !result?.data?.url) {
      return NextResponse.json(
        { error: result?.message || "Upload failed" },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({ success: true, path: result.data.url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
