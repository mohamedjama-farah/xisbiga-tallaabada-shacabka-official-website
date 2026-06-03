import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders, sanitizeString } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  titleEn:   z.string().min(1).max(300),
  titleSo:   z.string().min(1).max(300),
  contentEn: z.string().min(1).max(50000),
  contentSo: z.string().min(1).max(50000),
  excerpt:   z.string().max(500).optional(),
  imageUrl:  z.string().url().max(500).optional().or(z.literal('')),
  published: z.boolean().default(false),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const posts = await prisma.newsPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, titleEn: true, titleSo: true, excerpt: true, imageUrl: true, published: true, createdAt: true },
  });

  return NextResponse.json({ posts }, { headers: securityHeaders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const post = await prisma.newsPost.create({
      data: {
        titleEn:   sanitizeString(data.titleEn),
        titleSo:   sanitizeString(data.titleSo),
        contentEn: sanitizeString(data.contentEn),
        contentSo: sanitizeString(data.contentSo),
        excerpt:   data.excerpt ? sanitizeString(data.excerpt) : null,
        imageUrl:  data.imageUrl || null,
        published: data.published,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201, headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
