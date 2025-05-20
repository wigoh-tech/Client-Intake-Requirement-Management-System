// pages/api/intake/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import logger from "../utils/logger";
import { isRateLimited } from "../middleware/rateLimit";
import { getAuth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

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
    const { answers, clientId } = body;

    if (!clientId) {
      return NextResponse.json({ message: "Client ID is required" }, { status: 400 });
    }

    if (!Array.isArray(answers)) {
      return NextResponse.json({ message: "Answers should be an array" }, { status: 400 });
    }

    // ✅ Save intake answers
    const answerData = answers.map(
      (ans: { questionId: number; answer: string }) => ({
        questionId: ans.questionId,
        answer: ans.answer,
        clientId,
      })
    );
    await prisma.intakeAnswer.createMany({ data: answerData });

    // ✅ Extract and save Q14's answer if not already stored
    const question14Answer = answers.find((ans) => ans.questionId === 14);
    if (!question14Answer) {
      return NextResponse.json({ message: "Answer for question 14 is required" }, { status: 400 });
    }

    const existingRequirement = await prisma.requirement.findFirst({
      where: { clientId },
    });

    if (!existingRequirement) {
      await prisma.requirement.create({
        data: {
          clientId,
          answer: question14Answer.answer,
          status: "todo",
        },
      });
    }

    // ✅ Build requirement version content
    const versionContent = answers
      .map((ans) => `Q${ans.questionId}: ${ans.answer}`)
      .join("\n");

    const existingVersions = await prisma.requirementVersion.findMany({
      where: {
        clients: {
          some: { id: clientId },
        },
      },
    });

    const newVersion = `v${existingVersions.length + 1}.0`;

    // ✅ Get authenticated user
    const { userId } = getAuth(req);
    const user = await currentUser();
    if (!user?.username || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ Save requirement version
    await prisma.requirementVersion.create({
      data: {
        version: newVersion,
        content: versionContent,
        clerkId: userId,
        userName: user.username,
        clients: {
          connect: { id: clientId },
        },
      },
    });

    logger.info("Answers and version saved successfully.");
    return NextResponse.json(
      { message: "Answers submitted and version created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting answers:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Submission failed: ${errorMessage}`);
    return NextResponse.json(
      { message: "Server error saving answers", error: errorMessage },
      { status: 500 }
    );
  }
}


// Handle GET request for fetching answers

export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { message: "Missing clientId" },
        { status: 400 }
      );
    }

    // 1. Confirm the client exists
    const clientRecord = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });

    if (!clientRecord) {
      return NextResponse.json(
        { message: "Client not found for provided clientId" },
        { status: 404 }
      );
    }

    // 2. Get latest timestamp of intake answers
    const latestTimestamp = await prisma.intakeAnswer.findFirst({
      where: { clientId },
      orderBy: { timestamp: "desc" },
      select: { timestamp: true },
    });

    if (!latestTimestamp) {
      return NextResponse.json(
        { message: "No intake answers found for client" },
        { status: 404 }
      );
    }

    // 3. Get latest answers
    const latestAnswers = await prisma.intakeAnswer.findMany({
      where: {
        clientId,
        timestamp: latestTimestamp.timestamp,
      },
      select: {
        questionId: true,
        answer: true,
      },
    });

    return NextResponse.json({ clientId, answers: latestAnswers });
  } catch (error) {
    console.error("Error fetching latest answers:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server error fetching answers", error: errorMessage },
      { status: 500 }
    );
  }
}
