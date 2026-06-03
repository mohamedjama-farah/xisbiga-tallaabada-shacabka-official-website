import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Public endpoint — returns donation progress for the progress bar on the Donate page.
// No auth required. Shows only aggregate totals, never personal donor data.
export async function GET() {
  try {
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
    });
  } catch {
    return NextResponse.json({ raised: 0, goal: 10000, percent: 0, donorCount: 0 });
  }
}
