import { NextResponse } from "next/server";
import { BlogPost } from "@/types/blog.types";
import fs from "fs";
import path from "path";

// Path to the data file
const postsFilePath = path.join(process.cwd(), "db.json");

// Function to read data from the file
const readPostsFromFile = (): BlogPost[] => {
  try {
    const fileContent = fs.readFileSync(postsFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading from posts.json:", error);
    return [];
  }
};

// Function to write data to the file
const savePostsToFile = (posts: BlogPost[]) => {
  try {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to posts.json:", error);
  }
};

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const currentPosts = readPostsFromFile();
    const post = currentPosts.find((p) => String(p.id) === id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any).message || "An error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // id is a string
    console.log("Deleting post with id:", id);

    const currentPosts = readPostsFromFile();
    const postIndex = currentPosts.findIndex((p) => String(p.id) === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updatedPosts = currentPosts.filter((p) => String(p.id) !== id);
    savePostsToFile(updatedPosts);

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any).message || "An error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // id is a string
    console.log("Updating post with id:", id);

    const currentPosts = readPostsFromFile();
    const postIndex = currentPosts.findIndex((p) => String(p.id) === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updatedPost: BlogPost = await req.json();
    currentPosts[postIndex] = { ...currentPosts[postIndex], ...updatedPost };
    savePostsToFile(currentPosts);

    return NextResponse.json(currentPosts[postIndex]);
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any).message || "An error occurred" },
      { status: 500 }
    );
  }
}
