import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findMany({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const client = await prisma.client.findFirst({
    where: { userId: user[0]?.id },
    select: { id: true },
  });

  if (!client) {
    return NextResponse.json({ message: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({ clientId: client.id });
}
