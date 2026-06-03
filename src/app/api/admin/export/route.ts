import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

function toCSV(rows: Record<string, string | number | null | undefined>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
  ].join('\n');
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const type = req.nextUrl.searchParams.get('type') ?? 'members';

  let csv = '';
  let filename = 'export.csv';

  if (type === 'members') {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
      select: { firstName: true, lastName: true, email: true, phone: true, city: true, status: true, createdAt: true },
    });
    csv = toCSV(members.map(m => ({
      'First Name': m.firstName,
      'Last Name': m.lastName,
      'Email': m.email,
      'Phone': m.phone ?? '',
      'City': m.city ?? '',
      'Status': m.status,
      'Joined': m.createdAt.toISOString().slice(0, 10),
    })));
    filename = `xts-members-${new Date().toISOString().slice(0, 10)}.csv`;
  } else if (type === 'volunteers') {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { createdAt: 'desc' },
      select: { firstName: true, lastName: true, phone: true, email: true, city: true, type: true, skills: true, status: true, createdAt: true },
    });
    csv = toCSV(volunteers.map(v => ({
      'First Name': v.firstName,
      'Last Name': v.lastName,
      'Phone': v.phone,
      'Email': v.email ?? '',
      'City': v.city,
      'Type': v.type,
      'Skills': v.skills.join('; '),
      'Status': v.status,
      'Date': v.createdAt.toISOString().slice(0, 10),
    })));
    filename = `xts-volunteers-${new Date().toISOString().slice(0, 10)}.csv`;
  } else if (type === 'donations') {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      select: { fullName: true, phone: true, email: true, amount: true, currency: true, method: true, status: true, transactionId: true, createdAt: true },
    });
    csv = toCSV(donations.map(d => ({
      'Name': d.fullName,
      'Phone': d.phone,
      'Email': d.email ?? '',
      'Amount': d.amount,
      'Currency': d.currency,
      'Method': d.method,
      'Status': d.status,
      'Transaction ID': d.transactionId ?? '',
      'Date': d.createdAt.toISOString().slice(0, 10),
    })));
    filename = `xts-donations-${new Date().toISOString().slice(0, 10)}.csv`;
  } else if (type === 'newsletter') {
    const subs = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
      select: { email: true, name: true, city: true, createdAt: true },
    });
    csv = toCSV(subs.map(s => ({
      'Email': s.email,
      'Name': s.name ?? '',
      'City': s.city ?? '',
      'Subscribed': s.createdAt.toISOString().slice(0, 10),
    })));
    filename = `xts-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
  } else if (type === 'rsvps') {
    const rsvpList = await prisma.eventRSVP.findMany({ orderBy: { createdAt: 'desc' } });
    const evIds = [...new Set(rsvpList.map(r => r.eventId))];
    const evs = await prisma.event.findMany({ where: { id: { in: evIds } }, select: { id: true, titleEn: true } });
    const evMap = new Map(evs.map(e => [e.id, e.titleEn]));
    csv = toCSV(rsvpList.map(r => ({
      'Name': r.name,
      'Phone': r.phone,
      'Email': r.email ?? '',
      'Event': evMap.get(r.eventId) ?? '',
      'Date': r.createdAt.toISOString().slice(0, 10),
    })));
    filename = `xts-rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      ...securityHeaders,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
