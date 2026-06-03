import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders, rateLimit, getIP } from '@/lib/security';

export async function GET(req: NextRequest) {
  // Rate-limit: max 5 lookups per minute per IP (prevents email enumeration)
  const ip = getIP(req);
  if (!rateLimit(ip + ':card', 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429, headers: securityHeaders });
  }

  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400, headers: securityHeaders });

  const member = await prisma.member.findUnique({
    where: { email },
    // Only return what the member card needs — no city or internal timestamps exposed
    select: { id: true, firstName: true, lastName: true, status: true, createdAt: true },
  });

  // Always return the same error whether email exists or not (prevents email enumeration)
  if (!member || member.status !== 'APPROVED') {
    return NextResponse.json({ error: 'No approved member found with that email address.' }, { status: 404, headers: securityHeaders });
  }

  return NextResponse.json({ member }, { headers: securityHeaders });
}
