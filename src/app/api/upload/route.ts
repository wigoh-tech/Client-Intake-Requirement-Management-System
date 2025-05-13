// pages/api/upload.ts
import { IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import os from "os";
import path from "path";

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

const parseForm = async (
  req: IncomingMessage
): Promise<{ fields: any; files: any }> => {
  const form = formidable({
    uploadDir: os.tmpdir(), 
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const questionId = parseInt(fields.questionId?.[0] || fields.questionId);
    const clientId = fields.clientId?.[0] || fields.clientId;

    if (!file || !questionId || !clientId) {
      return res.status(400).json({ message: "Missing file or data" });
    }

    // Step 1: Save intake answer
    const intakeAnswer = await prisma.intakeAnswer.create({
      data: {
        clientId,
        questionId,
        answer: "",
      },
    });

    // Step 2: Save file metadata (path is in temp folder)
    await prisma.uploadFile.create({
      data: {
        intakeAnswerId: intakeAnswer.id,
        filePath: file.filepath,
      },
    });

    return res.status(200).json({ message: "File uploaded and saved!" });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
}
