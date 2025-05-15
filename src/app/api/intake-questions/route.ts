// src/app/api/intake-questions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import logger from '../utils/logger';

export async function GET() {
  try {
    const questions = await prisma.intakeQuestion.findMany();
    return NextResponse.json(questions);
  } catch (error) {
    logger.error('Error fetching questions:', error);
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { message: 'Server error fetching questions' },
      { status: 500 }
    );
  }
}
