import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { clientId, questionIds } = await req.json();

    if (!clientId) {
      return NextResponse.json({ message: 'Missing clientId' }, { status: 400 });
    }

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ message: 'Missing or empty questionIds' }, { status: 400 });
    }

    // 1. Create the form assignment
    const formAssignment = await prisma.formAssignments.create({
      data: {
        clientId,
        questionIds,
      },
    });

    // 2. Create a notification linked to this form assignment
    const notificationMessage = 'You have received a new intake form. Please complete it.';

    await prisma.userNotification.create({
      data: {
        clientId,
        message: notificationMessage,
        formId: formAssignment.id,
      },
    });

    return NextResponse.json({ message: 'Form assigned and notification sent' }, { status: 200 });
  } catch (error) {
    console.error('Error in form-assign API:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
