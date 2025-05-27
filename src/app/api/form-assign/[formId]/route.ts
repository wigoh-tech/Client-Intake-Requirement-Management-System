import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest, context: { params: { formId: string } }) {
  const formIdRaw = context.params.formId; 

  const formId = parseInt(formIdRaw);
  if (isNaN(formId)) {
    return NextResponse.json({ message: 'Invalid form ID' }, { status: 400 });
  }

  try {
    const formAssignment = await prisma.formAssignments.findUnique({
      where: { id: formId },
    });

    if (!formAssignment) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }

    const questions = await prisma.intakeQuestion.findMany({
      where: {
        id: {
          in: formAssignment.questionIds,
        },
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
