import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  titleEn: z.string().min(3).max(200),
  titleSo: z.string().min(3).max(200),
  descEn: z.string().min(10).max(2000),
  descSo: z.string().min(10).max(2000),
  goal: z.number().min(10).max(1000000).default(1000),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const petitions = await prisma.petition.findMany({
    include: { _count: { select: { signatures: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ petitions }, { headers: securityHeaders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const petition = await prisma.petition.create({ data });
    return NextResponse.json({ petition }, { status: 201, headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
