import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';
import { z } from 'zod';
import { notifyNewVolunteer } from '@/lib/email';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(6),
  city: z.string().min(1),
  region: z.string().optional(),
  skills: z.array(z.string()).default([]),
  availability: z.enum(['WEEKDAYS', 'WEEKENDS', 'ANYTIME', 'EVENINGS']).default('WEEKENDS'),
  message: z.string().optional(),
  type: z.enum(['GENERAL', 'CANVASSER']).default('GENERAL'),
  district: z.string().optional(),
  area: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });

  const data = parsed.data;
  const volunteer = await prisma.volunteer.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone,
      city: data.city,
      region: data.region || null,
      skills: data.skills,
      availability: data.availability,
      message: data.message || null,
      type: data.type,
      district: data.district || null,
      area: data.area || null,
    },
  });

  // Create admin notification
  await prisma.adminNotification.create({
    data: {
      type: data.type === 'CANVASSER' ? 'canvasser' : 'volunteer',
      title: `New ${data.type === 'CANVASSER' ? 'Canvasser' : 'Volunteer'}: ${data.firstName} ${data.lastName}`,
      body: `${data.city}${data.district ? ', ' + data.district : ''} — ${data.skills.join(', ') || 'General help'}`,
      link: '/admin/dashboard',
    },
  });

  notifyNewVolunteer({ firstName: volunteer.firstName, lastName: volunteer.lastName, phone: volunteer.phone, city: volunteer.city, type: volunteer.type }).catch(() => {});
  return NextResponse.json({ volunteer }, { status: 201, headers: securityHeaders });
}
