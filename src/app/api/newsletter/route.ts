import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders, rateLimit, getIP, sanitizeString } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimit(ip + ':newsletter', 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: securityHeaders });
  }
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await prisma.newsletterSubscriber.upsert({
      where: { email: data.email.toLowerCase() },
      update: {},
      create: {
        email: data.email.toLowerCase(),
        name: data.name ? sanitizeString(data.name) : null,
        city: data.city ? sanitizeString(data.city) : null,
      },
    });
    return NextResponse.json({ ok: true }, { headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid email' }, { status: 400, headers: securityHeaders });
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
