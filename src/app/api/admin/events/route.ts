import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  titleEn: z.string().min(2),
  titleSo: z.string().min(2),
  descEn: z.string().min(2),
  descSo: z.string().min(2),
  location: z.string().min(1),
  date: z.string(),
  time: z.string().optional(),
  type: z.enum(['RALLY', 'TOWN_HALL', 'FUNDRAISER', 'MEETING', 'TRAINING', 'OTHER']).default('OTHER'),
  online: z.boolean().default(false),
  published: z.boolean().default(true),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
  
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    return NextResponse.json({ events }, { headers: securityHeaders });
    } catch (e) {
    console.error('[events]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });
  try {
  
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
  
    const event = await prisma.event.create({
      data: { ...parsed.data, date: new Date(parsed.data.date) },
    });
    return NextResponse.json({ event }, { status: 201, headers: securityHeaders });
    } catch (e) {
    console.error('[events]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
