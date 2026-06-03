import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { securityHeaders } from '@/lib/security';

const schema = z.object({ status: z.enum(['APPROVED', 'REJECTED', 'PENDING']) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  const body = await req.json();
  const { status } = schema.parse(body);

  const member = await prisma.member.update({ where: { id }, data: { status } });
  return NextResponse.json({ member }, { headers: securityHeaders });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  try {
    await prisma.member.delete({ where: { id } });
    return NextResponse.json({ success: true }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: securityHeaders });
  }
}
