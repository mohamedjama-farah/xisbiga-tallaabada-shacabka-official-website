import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  const { id } = await params;
  const { status, read } = await req.json();
  const complaint = await prisma.complaint.update({ where: { id }, data: { ...(status && { status }), ...(read !== undefined && { read }) } });
  return NextResponse.json({ complaint }, { headers: securityHeaders });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  const { id } = await params;
  await prisma.complaint.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { headers: securityHeaders });
}
