import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import logger from "../utils/logger";

export async function POST(req: Request) {
  try {
    const { id, email, userName } = await req.json();

    if (!email || !userName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const clientId = id || nanoid(6); // Generate ID if not provided

    // 2. Create client
    const client = await prisma.client.create({
      data: {
        id: clientId,
        userId: user ? user.id : undefined,
        email,
        userName,
      },
    });

    // 3. If client is linked to a user, update user status
    if (user?.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: "clientloggedin" },
      });
      console.log(`Updated user ${user.id} status to clientloggedin`);
    }
    logger.info("client register Successfully..", { status: 201 });
    return NextResponse.json(client, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error registering client:", error);
      logger.error(error.message, { status: 500 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error:", error);
      logger.error("Unexpected error", { status: 500 });
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        userName: true,
        email: true,
      },
    });
    logger.info("client data get Successfully..", { status: 200 });
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    logger.error("Error fetching clients:", error, { status: 500 });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
