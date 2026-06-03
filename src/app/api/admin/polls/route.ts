import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const polls = await prisma.poll.findMany({
    include: { options: { include: { _count: { select: { votes: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ polls }, { headers: securityHeaders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { questionEn, questionSo, options, endsAt } = await req.json();
  if (!questionEn || !questionSo || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
  }

  const poll = await prisma.poll.create({
    data: {
      questionEn,
      questionSo,
      endsAt: endsAt ? new Date(endsAt) : null,
      options: {
        create: options.map((o: { labelEn: string; labelSo: string }) => ({ labelEn: o.labelEn, labelSo: o.labelSo })),
      },
    },
    include: { options: { include: { _count: { select: { votes: true } } } } },
  });

  return NextResponse.json({ poll }, { headers: securityHeaders });
}
