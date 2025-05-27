import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });
  }

  try {
    const notifications = await prisma.userNotification.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

