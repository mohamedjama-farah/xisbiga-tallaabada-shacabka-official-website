import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders, rateLimit, getIP, sanitizeString } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2).max(100),
  phone: z.string().min(6).max(20),
  email: z.string().email().optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimit(ip + ':rsvp', 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: securityHeaders });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Check event exists
    const event = await prisma.event.findUnique({ where: { id: data.eventId, published: true } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404, headers: securityHeaders });

    const rsvp = await prisma.eventRSVP.create({
      data: {
        eventId: data.eventId,
        name: sanitizeString(data.name),
        phone: sanitizeString(data.phone),
        email: data.email ? data.email.toLowerCase() : null,
      },
    });

    // Notify admins
    await prisma.adminNotification.create({
      data: {
        type: 'rsvp',
        title: `New RSVP: ${event.titleEn}`,
        body: `${data.name} (${data.phone}) registered to attend.`,
        link: '/admin/dashboard?tab=events',
      },
    });

    return NextResponse.json({ ok: true, id: rsvp.id }, { headers: securityHeaders });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'You have already registered for this event.' }, { status: 409, headers: securityHeaders });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ count: 0 }, { headers: securityHeaders });
  const count = await prisma.eventRSVP.count({ where: { eventId } });
  return NextResponse.json({ count }, { headers: securityHeaders });
}
