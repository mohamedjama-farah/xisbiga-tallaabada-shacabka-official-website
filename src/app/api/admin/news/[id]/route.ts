import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders, sanitizeString } from '@/lib/security';
import { z } from 'zod';

const patchSchema = z.object({
  titleEn:   z.string().min(1).max(300).optional(),
  titleSo:   z.string().min(1).max(300).optional(),
  contentEn: z.string().min(1).max(50000).optional(),
  contentSo: z.string().min(1).max(50000).optional(),
  excerpt:   z.string().max(500).optional().nullable(),
  imageUrl:  z.string().url().max(500).optional().nullable(),
  published: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  try {
    const body = await req.json();
    const data = patchSchema.parse(body);

    const update: Record<string, unknown> = {};
    if (data.titleEn   !== undefined) update.titleEn   = sanitizeString(data.titleEn);
    if (data.titleSo   !== undefined) update.titleSo   = sanitizeString(data.titleSo);
    if (data.contentEn !== undefined) update.contentEn = sanitizeString(data.contentEn);
    if (data.contentSo !== undefined) update.contentSo = sanitizeString(data.contentSo);
    if (data.excerpt   !== undefined) update.excerpt   = data.excerpt ? sanitizeString(data.excerpt) : null;
    if (data.imageUrl  !== undefined) update.imageUrl  = data.imageUrl || null;
    if (data.published !== undefined) update.published = data.published;

    const post = await prisma.newsPost.update({ where: { id }, data: update });
    return NextResponse.json({ success: true, post }, { headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: securityHeaders });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  try {
    await prisma.newsPost.delete({ where: { id } });
    return NextResponse.json({ success: true }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: securityHeaders });
  }
}
