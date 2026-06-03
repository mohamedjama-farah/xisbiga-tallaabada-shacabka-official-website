import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = schema.parse(body);

    const admin = await prisma.adminUser.findUnique({ where: { email: session.user.email } });
    if (!admin) return NextResponse.json({ error: 'User not found' }, { status: 404, headers: securityHeaders });

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 403, headers: securityHeaders });

    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.adminUser.update({ where: { email: session.user.email }, data: { password: hash } });

    return NextResponse.json({ ok: true }, { headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400, headers: securityHeaders });
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
