// src/app/api/upload/route.ts
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Parse multipart form using formidable
const parseForm = async (req: any): Promise<{ fields: any; files: any }> => {
  const form = formidable({
    uploadDir: path.join(process.cwd(), 'uploads'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const questionId = parseInt(fields.questionId?.[0] || fields.questionId);
    const clientId = fields.clientId?.[0] || fields.clientId;

    if (!file || !questionId || !clientId) {
      return new Response(JSON.stringify({ message: 'Missing file or data' }), { status: 400 });
    }

    // Step 1: Save intake answer
    const intakeAnswer = await prisma.intakeAnswer.create({
      data: {
        clientId,
        questionId,
        answer: '',
      },
    });

    // Step 2: Save file metadata
    await prisma.uploadFile.create({
      data: {
        intakeAnswerId: intakeAnswer.id,
        filePath: file.filepath,
      },
    });

    return new Response(JSON.stringify({ message: 'File uploaded and saved!' }), {
      status: 200,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ message: 'Upload failed', error: error.message }), {
      status: 500,
    });
  }
}
