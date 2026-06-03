import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';
import { z } from 'zod';

const patchSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'MEDIA_ADMIN', 'MEMBERS_ADMIN', 'EDITOR']).optional(),
  name: z.string().min(2).max(100).optional(),
});

function isSuperAdmin(session: unknown) {
  return (session as { user?: { role?: string } })?.user?.role === 'SUPER_ADMIN';
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !isSuperAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: securityHeaders });
  }

  const { id } = await params;
  const body = await req.json();
  const data = patchSchema.parse(body);

  const user = await prisma.adminUser.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json({ user }, { headers: securityHeaders });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !isSuperAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: securityHeaders });
  }

  const { id } = await params;
  const currentUser = session.user as { email?: string };

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (target?.email === currentUser?.email) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400, headers: securityHeaders });
  }

  try {
    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: securityHeaders });
  }
}
