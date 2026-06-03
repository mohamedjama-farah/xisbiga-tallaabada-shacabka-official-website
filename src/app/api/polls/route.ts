import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const polls = await prisma.poll.findMany({
    where: { active: true },
    include: {
      options: {
        include: { _count: { select: { votes: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ polls }, { headers: securityHeaders });
}

export async function POST(req: NextRequest) {
  // Vote on an option
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const { optionId } = await req.json();
  if (!optionId) return NextResponse.json({ error: 'optionId required' }, { status: 400, headers: securityHeaders });

  try {
    await prisma.pollVote.create({ data: { optionId, ip } });
    // Return updated counts
    const option = await prisma.pollOption.findUnique({
      where: { id: optionId },
      include: { poll: { include: { options: { include: { _count: { select: { votes: true } } } } } } },
    });
    return NextResponse.json({ ok: true, poll: option?.poll }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Already voted or invalid option' }, { status: 409, headers: securityHeaders });
  }
}
