import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(20, parseInt(searchParams.get('limit') ?? '9'));

  const [posts, total] = await Promise.all([
    prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, titleEn: true, titleSo: true, excerpt: true, imageUrl: true, createdAt: true },
    }),
    prisma.newsPost.count({ where: { published: true } }),
  ]);

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) }, { headers: securityHeaders });
}
