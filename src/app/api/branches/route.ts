import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { published: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(branches);
  } catch {
    return NextResponse.json([]);
  }
}
