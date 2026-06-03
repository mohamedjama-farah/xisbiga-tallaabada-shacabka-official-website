import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  try {
    await prisma.contactMessage.update({ where: { id }, data: { read: true } });
    return NextResponse.json({ success: true }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: securityHeaders });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: securityHeaders });
  }
}
