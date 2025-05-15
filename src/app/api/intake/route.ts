// pages/api/intake-submission/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import logger from '../utils/logger';
import { isRateLimited } from "../middleware/rateLimit"; 

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (isRateLimited(ip)) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      { message: "Too many requests from this IP, please try again later." },
      { status: 429 }
    );
  }
  try {
    const body = await req.json();
    const { answers, clientId, formType } = body;

    if (!clientId) {
      return NextResponse.json(
        { message: "Client ID is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { message: "Answers should be an array" },
        { status: 400 }
      );
    }

    if (formType === 'intake') {
      // Store in both intakeAnswer and requirementVersion
      const answerData = answers.map(
        (ans: { questionId: number; answer: string }) => ({
          questionId: ans.questionId,
          answer: ans.answer,
          clientId,
        })
      );
      await prisma.intakeAnswer.createMany({ data: answerData });
    }

    // Create version content using all answers (this applies to both modes)
    const versionContent = answers
      .map(
        (ans: { questionId: number; answer: string }) =>
          `Q${ans.questionId}: ${ans.answer}`
      )
      .join("\n");

    const existingVersions = await prisma.requirementVersion.findMany({
      where: {
        clients: {
          some: { id: clientId },
        },
      },
    });

    const newVersion = `v${existingVersions.length + 1}.0`;

    // Store in requirementVersion
    await prisma.requirementVersion.create({
      data: {
        version: newVersion,
        content: versionContent, 
        clients: {
          connect: {
            id: clientId,
          },
        },
      },
    });
    logger.info('Intake submitted successfully.');
    return NextResponse.json(
      { message: "Answers submitted and version created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting answers:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
      if (error instanceof Error) {
        logger.error(`Submission failed: ${error.message}`);
      } else {
        logger.error("Submission failed: Unknown error");
      }
    return NextResponse.json(
      { message: "Server error saving answers", error: errorMessage },
      { status: 500 }
    );
  }
}



// Handle GET request for fetching answers

export async function GET(req: NextRequest) {
  try {
    // Get the first clientId from intakeAnswer table
    const firstAnswer = await prisma.intakeAnswer.findFirst({
      select: { clientId: true },
      orderBy: { timestamp: 'asc' }, // or whatever order you want
    });

    if (!firstAnswer) {
      return NextResponse.json(
        { message: "No intake answers found" },
        { status: 404 }
      );
    }

    const clientId = firstAnswer.clientId;

    // Fetch answers for that clientId
    const answers = await prisma.intakeAnswer.findMany({
      where: { clientId },
      select: {
        questionId: true,
        answer: true,
      },
    });

    return NextResponse.json({ clientId, answers });
  } catch (error) {
    console.error("Error fetching answers:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server error fetching answers", error: errorMessage },
      { status: 500 }
    );
  }
}
