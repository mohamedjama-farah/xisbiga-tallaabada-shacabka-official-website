import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { rateLimit, getIP, sanitizeString, securityHeaders } from '@/lib/security';
import { notifyNewMember } from '@/lib/email';

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  city: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimit(ip, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: securityHeaders });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existingEmail = await prisma.member.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existingEmail) {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 409, headers: securityHeaders });
    }

    if (data.phone) {
      const existingPhone = await prisma.member.findFirst({ where: { phone: data.phone.trim() } });
      if (existingPhone) {
        return NextResponse.json({ error: 'This phone number is already registered' }, { status: 409, headers: securityHeaders });
      }
    }

    const member = await prisma.member.create({
      data: {
        firstName: sanitizeString(data.firstName),
        lastName: sanitizeString(data.lastName),
        email: data.email.toLowerCase(),
        phone: data.phone ? sanitizeString(data.phone) : null,
        city: data.city ? sanitizeString(data.city) : null,
        message: data.message ? sanitizeString(data.message) : null,
      },
    });

    // Fire-and-forget email (doesn't block response)
    notifyNewMember({ firstName: member.firstName, lastName: member.lastName, email: member.email, city: member.city, phone: member.phone }).catch(() => {});

    return NextResponse.json({ success: true, id: member.id }, { headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
