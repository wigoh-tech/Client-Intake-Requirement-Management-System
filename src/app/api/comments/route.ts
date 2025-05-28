// /src/app/api/comment/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type Sender = {
  name: string;
  role: string;
  email: string;
};

type Message = {
  sender: Sender;
  message: string;
  time: string;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content: newMessageText, requirementVersionId } = body;

    if (!newMessageText) {
      return NextResponse.json(
        { message: "Missing required field: content." },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { message: "Clerk error: " + errorText },
        { status: 500 }
      );
    }

    const clerkUser = await response.json();

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      include: {
        clients: {
          include: {
            requirementVersions: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found in DB" },
        { status: 404 }
      );
    }

    let finalRequirementVersionId = requirementVersionId;

    const clientWithVersion = await prisma.client.findFirst({
      where: {
        requirementVersions: {
          some: {
            id: finalRequirementVersionId,
          },
        },
      },
      include: {
        requirementVersions: true,
      },
    });

    if (!clientWithVersion) {
      return NextResponse.json(
        { message: "No client found for the provided requirementVersionId." },
        { status: 400 }
      );
    }

    const sender: Sender = {
      name:
        clerkUser.username || clerkUser.first_name || clerkUser.id || "Unknown",
      email:
        clerkUser.email_addresses?.[0]?.email_address || "no-email@example.com",
      role: user.role === "admin" ? "admin" : "client",
    };

    const message: Message = {
      sender,
      message: newMessageText,
      time: new Date().toISOString(),
    };

    // Check if comment thread exists
    const existingComment = await prisma.comment.findFirst({
      where: {
        userId: user.id,
        requirementVersionId: Number(finalRequirementVersionId),
      },
    });

    if (existingComment) {
      const updatedContent = Array.isArray(existingComment.content)
        ? [...existingComment.content, message]
        : [message];

      const updatedComment = await prisma.comment.update({
        where: { id: existingComment.id },
        data: {
          content: updatedContent,
        },
      });

      await fetch("http://localhost:4000/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedComment),
      });

      return NextResponse.json(updatedComment, { status: 200 });
    } else {
      const newComment = await prisma.comment.create({
        data: {
          content: [message],
          author: sender,
          sender,
          requirementVersionId: Number(finalRequirementVersionId),
          userId: user.id,
        },
      });

      await fetch("http://localhost:4000/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      return NextResponse.json(newComment, { status: 201 });
    }
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requirementVersionId = Number(searchParams.get("requirementVersionId"));

  if (!requirementVersionId) {
    return NextResponse.json(
      { message: "requirementVersionId is required" },
      { status: 400 }
    );
  }

  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const comments = await prisma.comment.findMany({
      where: { requirementVersionId },
    });

    if (!comments.length) {
      return NextResponse.json(
        { message: "No comments found", content: [] },
        { status: 200 }
      );
    }

    // Flatten all messages from all comment records
    const allMessages: Message[] = comments.flatMap((comment) => {
      const content = comment.content;
      if (Array.isArray(content)) {
        return content as Message[];
      }
      return [];
    });

    allMessages.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    return NextResponse.json({ content: allMessages }, { status: 200 });
  } catch (err) {
    console.error("Fetch comments error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
