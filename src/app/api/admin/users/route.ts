import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const createSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  password: z.string().min(8).max(100),
  role: z.enum(['SUPER_ADMIN', 'MEDIA_ADMIN', 'MEMBERS_ADMIN', 'EDITOR']),
});

function isSuperAdmin(session: unknown) {
  return (session as { user?: { role?: string } })?.user?.role === 'SUPER_ADMIN';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !isSuperAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: securityHeaders });
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ users }, { headers: securityHeaders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isSuperAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: securityHeaders });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const existing = await prisma.adminUser.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409, headers: securityHeaders });

    const hash = await bcrypt.hash(data.password, 12);
    const user = await prisma.adminUser.create({
      data: { name: data.name, email: data.email.toLowerCase(), password: hash, role: data.role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201, headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
