import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalMembers, pendingMembers, approvedMembers, rejectedMembers,
    totalMessages, unreadMessages,
    totalNews, publishedNews,
    totalDonations, confirmedDonations, donationSum,
    adminUsers,
    totalVolunteers, totalComplaints, openComplaints, totalEvents,
    recentMembers,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { status: 'PENDING' } }),
    prisma.member.count({ where: { status: 'APPROVED' } }),
    prisma.member.count({ where: { status: 'REJECTED' } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.newsPost.count(),
    prisma.newsPost.count({ where: { published: true } }),
    prisma.donation.count(),
    prisma.donation.count({ where: { status: 'CONFIRMED' } }),
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: 'CONFIRMED' } }),
    prisma.adminUser.count(),
    prisma.volunteer.count(),
    prisma.complaint.count(),
    prisma.complaint.count({ where: { status: 'OPEN' } }),
    prisma.event.count({ where: { published: true } }),
    prisma.member.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  // Build daily signup chart for last 30 days
  const dailySignups: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailySignups[key] = 0;
  }
  for (const m of recentMembers) {
    const key = m.createdAt.toISOString().slice(0, 10);
    if (key in dailySignups) dailySignups[key]++;
  }
  const signupChart = Object.entries(dailySignups).map(([date, count]) => ({ date, count }));

  return NextResponse.json({
    members: { total: totalMembers, pending: pendingMembers, approved: approvedMembers, rejected: rejectedMembers },
    messages: { total: totalMessages, unread: unreadMessages },
    news: { total: totalNews, published: publishedNews },
    donations: { total: totalDonations, confirmed: confirmedDonations, totalUSD: donationSum._sum.amount ?? 0 },
    adminUsers,
    volunteers: totalVolunteers,
    complaints: { total: totalComplaints, open: openComplaints },
    events: totalEvents,
    signupChart,
  }, { headers: securityHeaders });
}
