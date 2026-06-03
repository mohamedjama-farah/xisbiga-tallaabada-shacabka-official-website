import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const candidates = await prisma.candidate.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true, firstName: true, lastName: true,
      level: true, state: true, region: true,
      district: true, constituency: true, notes: true,
    },
    orderBy: [{ level: 'asc' }, { state: 'asc' }, { firstName: 'asc' }],
  });
  return NextResponse.json({ candidates }, { headers: securityHeaders });
}
