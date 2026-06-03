import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const video = await prisma.video.findFirst({
      where: { published: true, featured: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(video ?? null);
  } catch {
    return NextResponse.json(null);
  }
}
