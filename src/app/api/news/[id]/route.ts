import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const post = await prisma.newsPost.findUnique({
      where: { id, published: true },
      select: {
        id: true,
        titleEn: true,
        titleSo: true,
        contentEn: true,
        contentSo: true,
        excerpt: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: securityHeaders });
    }
    return NextResponse.json({ post }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
