import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
  
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  
    const total = await prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: 'CONFIRMED' },
    });
  
    return NextResponse.json({ donations, totalConfirmed: total._sum.amount ?? 0 }, { headers: securityHeaders });
    } catch (e) {
    console.error('[donations]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
