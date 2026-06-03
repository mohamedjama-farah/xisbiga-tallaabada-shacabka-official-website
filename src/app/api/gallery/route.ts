import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const items = await prisma.mediaItem.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ items }, { headers: securityHeaders });
}
