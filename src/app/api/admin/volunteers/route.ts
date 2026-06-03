import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
    const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ volunteers }, { headers: securityHeaders });
    } catch (e) {
    console.error('[volunteers]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
