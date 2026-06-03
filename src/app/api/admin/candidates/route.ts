import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders, sanitizeString } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  firstName:    z.string().min(1).max(100),
  lastName:     z.string().min(1).max(100),
  email:        z.string().email().max(200).optional().or(z.literal('')),
  phone:        z.string().max(30).optional(),
  level:        z.enum(['FEDERAL_UPPER', 'FEDERAL_LOWER', 'STATE']),
  state:        z.string().max(100).optional(),
  region:       z.string().max(100).optional(),
  district:     z.string().max(100).optional(),
  subdistrict:  z.string().max(100).optional(),
  constituency: z.string().max(200).optional(),
  notes:        z.string().max(1000).optional(),
  status:       z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('ACTIVE'),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const candidates = await prisma.candidate.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ candidates }, { headers: securityHeaders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const candidate = await prisma.candidate.create({
      data: {
        firstName:    sanitizeString(data.firstName),
        lastName:     sanitizeString(data.lastName),
        email:        data.email || null,
        phone:        data.phone || null,
        level:        data.level,
        state:        data.state || null,
        region:       data.region || null,
        district:     data.district || null,
        subdistrict:  data.subdistrict || null,
        constituency: data.constituency || null,
        notes:        data.notes ? sanitizeString(data.notes) : null,
        status:       data.status,
      },
    });

    return NextResponse.json({ candidate }, { status: 201, headers: securityHeaders });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400, headers: securityHeaders });
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
