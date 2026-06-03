import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders, rateLimit, getIP, sanitizeString } from '@/lib/security';
import { z } from 'zod';
import { notifyNewComplaint } from '@/lib/email';

const schema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().min(2).max(100),
  category: z.string().min(2).max(50),
  subject: z.string().min(5).max(200),
  body: z.string().min(20).max(5000),
});

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimit(ip + ':complaint', 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429, headers: securityHeaders });
  }

  try {
    const json = await req.json();
    const data = schema.parse(json);

    const complaint = await prisma.complaint.create({
      data: {
        fullName: sanitizeString(data.fullName),
        phone: data.phone ? sanitizeString(data.phone) : null,
        email: data.email ? data.email.toLowerCase() : null,
        city: sanitizeString(data.city),
        category: sanitizeString(data.category),
        subject: sanitizeString(data.subject),
        body: sanitizeString(data.body),
      },
    });

    // Notify admins
    await prisma.adminNotification.create({
      data: {
        type: 'complaint',
        title: 'New Citizen Complaint',
        body: `${data.fullName} from ${data.city}: ${data.subject}`,
        link: '/admin/dashboard?tab=complaints',
      },
    });

    notifyNewComplaint({ fullName: data.fullName, city: data.city, subject: data.subject, category: data.category }).catch(() => {});
    return NextResponse.json({ ok: true, id: complaint.id }, { headers: securityHeaders });
  } catch (err) {
    console.error('Complaint error:', err);
    return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
  }
}
