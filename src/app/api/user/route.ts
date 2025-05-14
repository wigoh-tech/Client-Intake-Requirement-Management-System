// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // make sure this import is valid

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { clients: true },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
  