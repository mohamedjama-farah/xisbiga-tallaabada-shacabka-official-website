import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const docs = await prisma.document.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ documents: docs }, { headers: securityHeaders });
}
