import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
  
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  
    return NextResponse.json({ messages }, { headers: securityHeaders });
    } catch (e) {
    console.error('[messages]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
