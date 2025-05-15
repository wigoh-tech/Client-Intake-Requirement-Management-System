// /src/app/api/comment/route.ts
import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/db';
import logger from '../utils/logger';
import { error } from 'winston';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, author, requirementVersionId, parentCommentId } = body;

    // Step 1: Ensure `requirementVersionId` exists in the database.
    const requirementVersion = await prisma.requirementVersion.findUnique({
      where: { id: 1 },
    });

    if (!requirementVersion) {
      return NextResponse.json({ message: "Requirement Version not found." }, { status: 404 });
    }

    // Step 2: Validate required fields
    if (!content || !author || !requirementVersionId) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Step 3: Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        author,
        requirementVersionId: Number(requirementVersionId),
        parentCommentId: parentCommentId ? Number(parentCommentId) : null,
      },
    });
    logger.info(JSON.stringify(newComment), { status: 201 });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    logger.error("Internal Server Error", { status: 500 } );
    console.error("Error creating comment:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requirementVersionId = url.searchParams.get("requirementVersionId");

  // Validate requirementVersionId
  if (!requirementVersionId) {
    return NextResponse.json({ message: "Missing requirementVersionId" }, { status: 400 });
  }

  try {
    // Fetch comments for the given requirementVersionId
    const comments = await prisma.comment.findMany({
      where: {
        requirementVersionId: Number(requirementVersionId),
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    logger.error("No comments found for this requirementVersionId" , { status: 404 });
    if (comments.length === 0) {
      return NextResponse.json({ message: "No comments found for this requirementVersionId" }, { status: 404 });
    }

    return NextResponse.json(comments);
  } catch (error) {
    logger.error("Internal Server Error" , { status: 500 });
    console.error("Error fetching comments:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


type Data =
  | { message: string }
  | {
      id: number;
      content: string;
      author: string;
      createdAt: string;
      requirementVersionId: number;
      parentCommentId?: number | null;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { content, author, requirementVersionId, parentCommentId } = req.body;

    // Validate required fields
    if (!content || !author || !requirementVersionId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      const newComment = await prisma.comment.create({
        data: {
          content,
          author,
          requirementVersionId: Number(requirementVersionId),
          parentCommentId: parentCommentId ?? null,
        },
      });
      logger.info('Message sent successfully', { status: 200 });
      return res.status(201).json({
        ...newComment,
        createdAt: newComment.createdAt.toISOString(),
      });
    } catch (error) {
      logger.error("API error creating comment:", error, { status: 500 });
      console.error("API error creating comment:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  logger.error("Method Not Allowed", error, { status: 405 });
  return res.status(405).json({ message: "Method Not Allowed" });
}