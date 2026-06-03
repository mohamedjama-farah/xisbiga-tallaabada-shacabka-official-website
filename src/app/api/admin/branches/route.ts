import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const branches = await prisma.branch.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(branches);
    } catch (e) {
    console.error('[branches]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    const branch = await prisma.branch.create({
      data: {
        nameEn: data.nameEn,
        nameSo: data.nameSo,
        stateEn: data.stateEn || '',
        stateSo: data.stateSo || '',
        addressEn: data.addressEn || '',
        addressSo: data.addressSo || '',
        phone: data.phone || null,
        email: data.email || null,
        hours: data.hours || null,
        type: data.type || 'Branch',
        published: data.published ?? true,
      },
    });
    return NextResponse.json(branch);
    } catch (e) {
    console.error('[branches]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
