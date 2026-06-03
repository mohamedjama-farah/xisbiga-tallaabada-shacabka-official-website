import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET() {
  const [members, volunteers, events, petitionSigs, rsvps] = await Promise.all([
    prisma.member.count({ where: { status: 'APPROVED' } }),
    prisma.volunteer.count({ where: { status: 'APPROVED' } }),
    prisma.event.count({ where: { published: true } }),
    prisma.petitionSignature.count(),
    prisma.eventRSVP.count(),
  ]);

  return NextResponse.json({
    members,
    volunteers,
    events,
    petitionSigs,
    rsvps,
    foundedYear: 2024,
    regions: 7, // static — number of Somalia regions with XTS presence
  }, { headers: securityHeaders });
}
