import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

/**
 * Send email blast to XTS members.
 * Requires env vars: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
 * Works with Gmail (set EMAIL_HOST=smtp.gmail.com, EMAIL_PORT=587, use App Password).
 * Falls back to logging emails if nodemailer is not configured.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  const { subject, body, filter } = await req.json();
  if (!subject || !body) {
    return NextResponse.json({ error: 'Subject and body are required' }, { status: 400, headers: securityHeaders });
  }

  // Build recipient list
  const where =
    filter === 'approved' ? { status: 'APPROVED' as const, email: { not: '' } }
    : filter === 'pending' ? { status: 'PENDING' as const, email: { not: '' } }
    : { email: { not: '' } };

  const members = await prisma.member.findMany({ where, select: { email: true, firstName: true, lastName: true } });
  const emails = members.filter(m => m.email);

  if (emails.length === 0) {
    return NextResponse.json({ error: 'No members with email addresses found' }, { status: 400, headers: securityHeaders });
  }

  // Try nodemailer if configured
  const hasMailConfig = process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS;

  if (hasMailConfig) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT ?? '587'),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      let sent = 0;
      let failed = 0;
      for (const member of emails) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_FROM ?? process.env.EMAIL_USER,
            to: member.email!,
            subject,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:auto">
              <div style="background:#1a2454;padding:20px;text-align:center">
                <h2 style="color:#c9a227;margin:0">Xisbiga Tallaabada Shacabka</h2>
              </div>
              <div style="padding:24px;background:#f9f9f9">
                <p>Salaam ${member.firstName},</p>
                ${body.split('\n').map((p: string) => `<p>${p}</p>`).join('')}
              </div>
              <div style="background:#1a2454;padding:12px;text-align:center">
                <p style="color:#c9a227;font-size:12px;margin:0">XTS — Xisbiga Tallaabada Shacabka</p>
              </div>
            </div>`,
          });
          sent++;
        } catch {
          failed++;
        }
      }
      return NextResponse.json({ ok: true, sent, failed, total: emails.length }, { headers: securityHeaders });
    } catch (err) {
      console.error('Email error:', err);
      return NextResponse.json({ error: 'Email service error. Check EMAIL_* environment variables.' }, { status: 500, headers: securityHeaders });
    }
  }

  // No mail config — return instructions
  return NextResponse.json({
    ok: false,
    demoMode: true,
    message: 'Email not configured. To enable: set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env.local',
    wouldSendTo: emails.map(m => m.email),
    total: emails.length,
  }, { headers: securityHeaders });
}
