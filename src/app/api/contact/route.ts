import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { rateLimit, getIP, sanitizeString, securityHeaders } from '@/lib/security';
import { notifyNewMessage } from '@/lib/email';

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(300),
  message: z.string().min(10).max(3000),
});

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: securityHeaders });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    await prisma.contactMessage.create({
      data: {
        name: sanitizeString(data.name),
        email: data.email.toLowerCase(),
        subject: sanitizeString(data.subject),
        message: sanitizeString(data.message),
      },
    });

    notifyNewMessage({ name: data.name, email: data.email, subject: data.subject }).catch(() => {});
    return NextResponse.json({ success: true }, { headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
