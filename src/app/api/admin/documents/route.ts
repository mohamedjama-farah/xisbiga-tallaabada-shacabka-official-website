import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  titleEn: z.string().min(1),
  titleSo: z.string().min(1),
  descEn: z.string().optional(),
  descSo: z.string().optional(),
  fileUrl: z.string().min(1),
  category: z.enum(['GENERAL', 'POLICY', 'PRESS', 'LEGAL', 'CONSTITUTION']).default('GENERAL'),
  published: z.boolean().default(true),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
    const documents = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ documents }, { headers: securityHeaders });
    } catch (e) {
    console.error('[documents]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    const doc = await prisma.document.create({ data: parsed.data });
    return NextResponse.json({ document: doc }, { status: 201, headers: securityHeaders });
    } catch (e) {
    console.error('[documents]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
