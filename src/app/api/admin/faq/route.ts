import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }] });
    return NextResponse.json(faqs);
    } catch (e) {
    console.error('[faq]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    const faq = await prisma.fAQ.create({
      data: {
        questionEn: data.questionEn,
        questionSo: data.questionSo,
        answerEn: data.answerEn,
        answerSo: data.answerSo,
        category: data.category || 'General',
        sortOrder: data.sortOrder ?? 0,
        active: data.active ?? true,
      },
    });
    return NextResponse.json(faq);
    } catch (e) {
    console.error('[faq]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
