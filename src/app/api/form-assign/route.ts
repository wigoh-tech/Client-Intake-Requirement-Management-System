import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { clientId, questionIds } = await req.json();

    if (!clientId || !questionIds?.length) {
      return NextResponse.json(
        { message: 'clientId and questionIds are required' },
        { status: 400 }
      );
    }

    // Save form assignment
    const formAssignment = await prisma.formAssignments.create({
      data: {
        clientId,
        questionIds,
      },
    });

    // Create notification for client
    await prisma.userNotification.create({
      data: {
        clientId,
        formId: formAssignment.id,
        message: 'You have a new form to fill!',
        isRead: false,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/form-assign:', error);
    return NextResponse.json(
      { message: 'Error assigning form' },
      { status: 500 }
    );
  }
}


