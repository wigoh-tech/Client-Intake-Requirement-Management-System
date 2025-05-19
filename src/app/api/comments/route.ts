// /src/app/api/comment/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import logger from "../utils/logger";
import { auth } from "@clerk/nextjs/server";



export async function POST(req: Request) {
  try {
    // 1. Clerk Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body
    const body = await req.json();
    const { content, requirementVersionId, parentCommentId } = body;

    if (!content || !requirementVersionId) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 3. Fetch Clerk User Info
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clerk API error:", errorText);
      return NextResponse.json(
        { message: "Failed to fetch user info." },
        { status: 500 }
      );
    }

    const clerkUser = await response.json();
    const author =
      clerkUser.username || clerkUser.first_name || clerkUser.id || "Unknown";

    // 4. Check requirement version exists
    const requirementVersion = await prisma.requirementVersion.findUnique({
      where: { id: Number(requirementVersionId) },
    });

    if (!requirementVersion) {
      return NextResponse.json(
        { message: "Requirement Version not found." },
        { status: 404 }
      );
    }

    // 5. Create Comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        author,
        requirementVersionId: Number(requirementVersionId),
        parentCommentId: parentCommentId ? Number(parentCommentId) : null,
        sender: author,
      },
    });

    await fetch("http://localhost:4000/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });

    logger?.info?.("Comment created successfully", { status: 201 });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    logger?.error?.("Error creating comment", { error, status: 500 });
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requirementVersionId = url.searchParams.get("requirementVersionId");

  if (!requirementVersionId) {
    return NextResponse.json(
      { message: "Missing requirementVersionId" },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { requirementVersionId: Number(requirementVersionId) },
      orderBy: { createdAt: "asc" },
    });

    if (comments.length === 0) {
      return NextResponse.json(
        { message: "No comments found for this requirementVersionId" },
        { status: 404 }
      );
    }

    return NextResponse.json(comments);
  } catch (error) {
    logger.error("Internal Server Error", { status: 500 });
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
