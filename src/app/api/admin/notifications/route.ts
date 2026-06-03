import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
    const notifications = await prisma.adminNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unread = await prisma.adminNotification.count({ where: { read: false } });
    return NextResponse.json({ notifications, unread }, { headers: securityHeaders });
    } catch (e) {
    console.error('[notifications]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
    const { ids, all } = await req.json();
    if (all) {
      await prisma.adminNotification.updateMany({ data: { read: true } });
    } else if (ids?.length) {
      await prisma.adminNotification.updateMany({ where: { id: { in: ids } }, data: { read: true } });
    }
    return NextResponse.json({ ok: true }, { headers: securityHeaders });
    } catch (e) {
    console.error('[notifications]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
