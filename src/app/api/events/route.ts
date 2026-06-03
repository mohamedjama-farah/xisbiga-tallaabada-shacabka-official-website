import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') ?? '50');

  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: 'asc' },
    take: limit,
  });

  return NextResponse.json({ events }, { headers: securityHeaders });
}
