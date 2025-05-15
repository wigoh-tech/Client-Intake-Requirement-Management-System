// pages/api/upload.ts
import { PrismaClient } from "@prisma/client";
import os from "os";
import path from "path";
import { NextResponse as NextServerResponse } from 'next/server';
import { promisify } from 'util';
import fs from 'fs';
import logger from "../utils/logger";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();


export async function POST(req: Request) {

  try {
    console.log("reached upload api");
    try{
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const clientId = formData.get('clientId') as string;
      const Id = formData.get('questionId') as string;
      const questionId = parseInt(Id);
      const uploadedFile = file;

      if (!file) {
        return new NextServerResponse(
          JSON.stringify({ message: 'No file uploaded' }),
          { status: 400 }
        );}

        const fileBuffer = await uploadedFile.arrayBuffer();
        const fileContent = new Uint8Array(fileBuffer); 
      // Step 1: Save intake answer
      const intakeAnswer = await prisma.intakeAnswer.create({
        data: {
          clientId,
          questionId,
          answer: "",
        }
      });
  
      // Step 2: Save file metadata (path is in temp folder)
      await prisma.uploadFile.create({
        data: {
          intakeAnswerId: intakeAnswer.id,
          filePath: path.join(os.tmpdir(), file.name),
          fileContent: fileContent,
        },
      });
      logger.info({ message: 'file uploaded' });
      return new NextServerResponse(
        JSON.stringify({ message: 'file uploaded' }),
        { status: 200 }
      );
    }catch (error:any) {
      logger.error("Error parsing form:", error);
      console.error("Error parsing form:", error);
      return new NextServerResponse(
        JSON.stringify({ message: "Error parsing form" }),
        { status: 500 }
      );
    }
   
  } catch (error: any) {
    logger.error("Upload error:", error);
    console.error("Upload error:", error);
    return new NextServerResponse(
      JSON.stringify({ message: "Upload error" }),
      { status: 500 }
    );
  }
}



export async function GET(req: Request) {
  try {
    const uploads = await prisma.uploadFile.findMany({
      include: {
        intakeAnswer: true, // if you want related info
      },
    });

    return new Response(JSON.stringify(uploads), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    return new Response(JSON.stringify({ message: "Error fetching uploads" }), {
      status: 500,
    });
  }
}