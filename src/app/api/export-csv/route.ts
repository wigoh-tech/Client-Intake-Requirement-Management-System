import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
  }

  const answers = await prisma.intakeAnswer.findMany({
    where: { clientId },
    include: {
      question: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  if (answers.length === 0) {
    return NextResponse.json({ error: "No answers found" }, { status: 404 });
  }

  const header = "Question,Answer,Date\n";

  const rows = answers.map((item) => {
    const question = item.question.question.replace(/"/g, '""');
    const answer = item.answer.replace(/"/g, '""');
    const date = item.timestamp.toISOString();
    return `"${question}","${answer}","${date}"`;
  });

  const csvData = header + rows.join("\n");

  return new NextResponse(csvData, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="intake_${clientId}.csv"`,
    },
  });
}
