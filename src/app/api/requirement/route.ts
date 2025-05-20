import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import logger from '../utils/logger';

export async function GET() {
  try {
    const requirements = await prisma.requirement.findMany({
      include: {
        client: {
          select: {
            userName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });

    return NextResponse.json(requirements, { status: 200 });
  } catch (error) {
    logger.error('Error fetching requirements:', error);
    console.error('Error fetching requirements:', error);
    return NextResponse.json(
      { message: 'Server error fetching requirements' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { status } = await req.json();
      const id = parseInt(params.id);
  
      if (!['todo', 'inProgress', 'done'].includes(status)) {
        return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
      }
  
      const updated = await prisma.requirement.update({
        where: { id },
        data: { status },
      });
  
      return NextResponse.json(updated);
    } catch (error) {
      console.error('Error updating requirement status:', error);
      return NextResponse.json(
        { message: 'Server error updating requirement status' },
        { status: 500 }
      );
    }
  }