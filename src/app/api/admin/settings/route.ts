import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;

  return NextResponse.json({ settings: map }, { headers: securityHeaders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || typeof key !== 'string' || typeof value !== 'string') {
      return NextResponse.json({ error: 'Invalid key/value' }, { status: 400, headers: securityHeaders });
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ setting }, { headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: securityHeaders });
  }
}
