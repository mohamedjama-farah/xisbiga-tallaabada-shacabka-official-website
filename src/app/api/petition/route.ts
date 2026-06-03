import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders, rateLimit, getIP, sanitizeString } from '@/lib/security';
import { z } from 'zod';

const signSchema = z.object({
  petitionId: z.string().min(1),
  name: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
});

export async function GET() {
  const petitions = await prisma.petition.findMany({
    where: { active: true },
    include: { _count: { select: { signatures: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ petitions }, { headers: securityHeaders });
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimit(ip + ':petition', 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: securityHeaders });
  }

  try {
    const body = await req.json();
    const data = signSchema.parse(body);

    await prisma.petitionSignature.create({
      data: {
        petitionId: data.petitionId,
        name: sanitizeString(data.name),
        city: sanitizeString(data.city),
        ip,
      },
    });

    const count = await prisma.petitionSignature.count({ where: { petitionId: data.petitionId } });
    return NextResponse.json({ ok: true, count }, { headers: securityHeaders });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'You have already signed this petition.' }, { status: 409, headers: securityHeaders });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
