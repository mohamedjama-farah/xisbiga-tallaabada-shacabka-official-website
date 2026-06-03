import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getIP, sanitizeString, securityHeaders } from '@/lib/security';
import { z } from 'zod';
import { notifyNewDonation } from '@/lib/email';

const donationSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal('')),
  amount: z.number().min(1).max(100000),
  currency: z.enum(['USD', 'SOS']),
  method: z.string().min(2).max(50),
  message: z.string().max(500).optional().or(z.literal('')),
  transactionId: z.string().max(100).optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimit(ip + ':donate', 3, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: securityHeaders });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: securityHeaders });
  }

  const parsed = donationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400, headers: securityHeaders });
  }

  const data = parsed.data;

  try {
    const donation = await prisma.donation.create({
      data: {
        fullName: sanitizeString(data.fullName),
        phone: sanitizeString(data.phone),
        email: data.email ? sanitizeString(data.email) : null,
        amount: data.amount,
        currency: data.currency,
        method: data.method,
        message: data.message ? sanitizeString(data.message) : null,
        transactionId: data.transactionId ? sanitizeString(data.transactionId) : null,
        status: 'PENDING',
      },
    });
    notifyNewDonation({ fullName: donation.fullName, amount: donation.amount, currency: donation.currency, method: donation.method, phone: donation.phone }).catch(() => {});
    return NextResponse.json({ success: true, id: donation.id }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
