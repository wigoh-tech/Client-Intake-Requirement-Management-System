import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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