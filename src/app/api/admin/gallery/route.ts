import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  titleEn: z.string().optional().default(''),
  titleSo: z.string().optional().default(''),
  caption: z.string().optional(),
  imageUrl: z.string().min(1),
  eventName: z.string().optional(),
  eventDate: z.string().optional(),
  published: z.boolean().default(true),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
    const items = await prisma.mediaItem.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ items }, { headers: securityHeaders });
    } catch (e) {
    console.error('[gallery]', e);
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
    const data = parsed.data;
    const autoTitle = `Photo ${new Date().toLocaleDateString('en-GB')}`;
    const item = await prisma.mediaItem.create({
      data: {
        titleEn: data.titleEn || autoTitle,
        titleSo: data.titleSo || autoTitle,
        caption: data.caption || null,
        imageUrl: data.imageUrl,
        eventName: data.eventName || null,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        published: data.published,
      },
    });
    return NextResponse.json({ item }, { status: 201, headers: securityHeaders });
    } catch (e) {
    console.error('[gallery]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
