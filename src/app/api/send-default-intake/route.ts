import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { clientId } = await req.json();

    if (!clientId) {
      return NextResponse.json({ message: 'Missing clientId' }, { status: 400 });
    }

    // Get all default questions
    const defaultQuestions = await prisma.intakeQuestion.findMany();

    // Assign the default form
    const formAssignment = await prisma.formAssignments.create({
      data: {
        clientId,
        questionIds: defaultQuestions.map(q => q.id),
      },
    });

    // Create notification for the client about this assignment
    await prisma.userNotification.create({
      data: {
        clientId,
        message: 'You have received a new default intake form.',
        formId: formAssignment.id,
      },
    });

    return NextResponse.json({ message: 'Default form assigned and notification sent' }, { status: 200 });
  } catch (error) {
    console.error('Error in send-default-intake API:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
