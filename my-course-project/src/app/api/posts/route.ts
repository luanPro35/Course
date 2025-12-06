import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


import { POSTS_API_URL, UPLOAD_IMAGE_POST_URL } from "@/services/api.service";

if (!POSTS_API_URL || !UPLOAD_IMAGE_POST_URL) {
  
  throw new Error(
    "POSTS_API_URL or UPLOAD_IMAGE_POST_URL is not defined in your environment variables."
  );
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const targetUrl = id ? `${POSTS_API_URL}/${id}` : POSTS_API_URL;
    const res = await fetch(targetUrl);

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "An unknown error occurred" }));
      return NextResponse.json(
        {
          error:
            errorData.message || `Failed to fetch data. Status: ${res.status}`,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET method:", error);
    return NextResponse.json(
      { error: "Không thể tải bài viết" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  const token = request.headers.get("Authorization");

  
  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await request.formData();

      const res = await fetch(UPLOAD_IMAGE_POST_URL, {
        method: "POST",
        headers: {
          ...(token && { Authorization: token }),
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "An unknown error occurred" }));
        return NextResponse.json(
          { error: errorData.message || "Failed to upload image" },
          { status: res.status }
        );
      }

      const result = await res.json();
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      console.error("Error in POST (upload) method:", error);
      return NextResponse.json(
        { error: "Error uploading image" },
        { status: 500 }
      );
    }
  }

  
  if (contentType.includes("application/json")) {
    try {
      const postData = await request.json();

      const res = await fetch(POSTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: token }),
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "An unknown error occurred" }));
        return NextResponse.json(
          { error: errorData.message || "Không thể lưu bài viết mới" },
          { status: res.status }
        );
      }

      const newPost = await res.json();
      return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
      console.error("Error in POST (create post) method:", error);
      return NextResponse.json(
        { error: "Lỗi khi tạo bài viết" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Unsupported Media Type" },
    { status: 415 }
  );
}


export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const token = request.headers.get("Authorization");

    const res = await fetch(`${POSTS_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "An unknown error occurred" }));
      return NextResponse.json(
        { error: errorData.message || "Không thể cập nhật bài viết" },
        { status: res.status }
      );
    }

    const updatedPost = await res.json();
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const token = request.headers.get("Authorization");
    const res = await fetch(`${POSTS_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: token }),
      },
    });

    if (!res.ok) {
      if (res.status === 204) {
        
        return new NextResponse(null, { status: 204 });
      }
      const errorData = await res
        .json()
        .catch(() => ({ message: "An unknown error occurred" }));
      return NextResponse.json(
        { error: errorData.message || "Không thể xóa bài viết" },
        { status: res.status }
      );
    }

    
    try {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        message: "Xóa bài viết thành công",
        deletedPost: data,
      });
    } catch (e) {
      
      return NextResponse.json({
        success: true,
        message: "Xóa bài viết thành công",
      });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
