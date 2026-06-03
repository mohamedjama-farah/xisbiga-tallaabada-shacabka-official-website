import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
  
    const rsvpRows = await prisma.eventRSVP.findMany({
      orderBy: { createdAt: 'desc' },
    });
  
    // Enrich with event title
    const eventIds = [...new Set(rsvpRows.map(r => r.eventId))];
    const events = await prisma.event.findMany({
      where: { id: { in: eventIds } },
      select: { id: true, titleEn: true },
    });
    const eventMap = new Map(events.map(e => [e.id, e.titleEn]));
  
    const rsvps = rsvpRows.map(r => ({
      ...r,
      event: { titleEn: eventMap.get(r.eventId) ?? '' },
    }));
  
    return NextResponse.json({ rsvps }, { headers: securityHeaders });
    } catch (e) {
    console.error('[rsvps]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
