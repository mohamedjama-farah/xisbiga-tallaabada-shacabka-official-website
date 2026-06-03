import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  try {
    const { id } = await params;
    const body = await req.json();
    const petition = await prisma.petition.update({
      where: { id },
      data: { active: body.active },
    });
    return NextResponse.json({ petition }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  await prisma.petition.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { headers: securityHeaders });
}
