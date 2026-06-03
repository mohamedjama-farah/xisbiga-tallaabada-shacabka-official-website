import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  const { id } = await params;
  await prisma.poll.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { headers: securityHeaders });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  const { id } = await params;
  const { active } = await req.json();
  const poll = await prisma.poll.update({ where: { id }, data: { active } });
  return NextResponse.json({ poll }, { headers: securityHeaders });
}
