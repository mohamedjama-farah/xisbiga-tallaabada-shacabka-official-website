import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  const { status, transactionId } = await req.json();

  const donation = await prisma.donation.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(transactionId !== undefined && { transactionId }),
    },
  });
  return NextResponse.json({ donation }, { headers: securityHeaders });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { id } = await params;
  await prisma.donation.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { headers: securityHeaders });
}
