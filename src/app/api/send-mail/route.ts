import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import logger from '../utils/logger';

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    if (!to || !subject || !text) {
      return NextResponse.json({ message: 'Missing email parameters' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    logger.info({ message: 'Email sent', info });
    return NextResponse.json({ message: 'Email sent', info });
  } catch (error: any) {
    logger.info('Email sending error:', error);
    console.error('Email sending error:', error);
    return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
  }
}


export async function GET() {
  return NextResponse.json({ status: 'Send Email route is working!' });
}
