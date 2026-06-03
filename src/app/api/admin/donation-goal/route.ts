import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

// Returns donation totals for the progress bar (public endpoint — shows only aggregate, not personal data)
export async function GET() {
  const [total, goalSetting, donorCount] = await Promise.all([
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: 'CONFIRMED', currency: 'USD' },
    }),
    prisma.siteSetting.findUnique({ where: { key: 'donation_goal' } }),
    prisma.donation.count({ where: { status: 'CONFIRMED' } }),
  ]);

  const raised = total._sum.amount ?? 0;
  const goal = goalSetting ? Number(goalSetting.value) : 10000;

  return NextResponse.json({
    raised,
    goal,
    percent: Math.min(100, Math.round((raised / goal) * 100)),
    donorCount,
  }, { headers: securityHeaders });
}
