/**
 * XTS Email Notification System
 * Uses nodemailer with any SMTP provider.
 *
 * Set these in .env.local:
 *   EMAIL_HOST=smtp.gmail.com          (or smtp.zoho.com, mail.xts-party.so, etc.)
 *   EMAIL_PORT=587
 *   EMAIL_USER=admin@xts-party.so
 *   EMAIL_PASS=your-password-here
 *   EMAIL_FROM=XTS Party <admin@xts-party.so>
 *   EMAIL_ADMIN=admin@xts-party.so     (where to receive alerts)
 */

import nodemailer from 'nodemailer';

function createTransport() {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_PORT ?? '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: { user, pass },
  });
}

const FROM = process.env.EMAIL_FROM ?? 'XTS Party <admin@xts-party.so>';
const ADMIN_EMAIL = process.env.EMAIL_ADMIN ?? process.env.EMAIL_USER ?? '';

function xtsEmail(title: string, rows: Record<string, string>, note?: string) {
  const rowsHtml = Object.entries(rows)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#999;font-size:13px;white-space:nowrap">${k}</td><td style="padding:6px 12px;color:#fff;font-size:13px">${v}</td></tr>`)
    .join('');

  return `<!DOCTYPE html>
<html><body style="margin:0;background:#0a1128;font-family:Arial,sans-serif">
<div style="max-width:540px;margin:32px auto;background:#1a2454;border-radius:16px;overflow:hidden;border:1px solid #c9a22740">
  <div style="background:#c9a227;padding:20px 28px">
    <img src="https://xts-party.so/logo.png" height="40" alt="XTS" style="margin-bottom:8px;display:block"/>
    <h2 style="margin:0;color:#1a2454;font-size:18px">${title}</h2>
  </div>
  <div style="padding:24px 28px">
    <table style="width:100%;border-collapse:collapse">${rowsHtml}</table>
    ${note ? `<p style="margin-top:20px;padding:12px;background:#ffffff10;border-radius:8px;color:#ccc;font-size:12px">${note}</p>` : ''}
    <div style="margin-top:24px;text-align:center">
      <a href="https://xts-party.so/admin/dashboard" style="display:inline-block;padding:12px 28px;background:#c9a227;color:#1a2454;border-radius:8px;font-weight:bold;text-decoration:none;font-size:14px">Open Admin Dashboard</a>
    </div>
  </div>
  <div style="padding:16px 28px;border-top:1px solid #ffffff15;color:#666;font-size:11px;text-align:center">
    Xisbiga Tallaabada Shacabka — XTS Party Somalia · This is an automated notification.
  </div>
</div></body></html>`;
}

async function sendToAdmin(subject: string, html: string) {
  if (!ADMIN_EMAIL) return; // email not configured — skip silently
  const transport = createTransport();
  if (!transport) return; // no SMTP configured — skip silently

  try {
    await transport.sendMail({ from: FROM, to: ADMIN_EMAIL, subject, html });
  } catch (err) {
    console.error('[XTS Email] Failed to send:', err);
  }
}

// ─── Notification helpers ──────────────────────────────────────────────────

export async function notifyNewMember(data: { firstName: string; lastName: string; email: string; city?: string | null; phone?: string | null }) {
  await sendToAdmin(
    `🟢 New Member: ${data.firstName} ${data.lastName}`,
    xtsEmail('New Party Member Registered', {
      'Full Name': `${data.firstName} ${data.lastName}`,
      'Email': data.email,
      'Phone': data.phone ?? '—',
      'City': data.city ?? '—',
      'Status': 'PENDING — Review in dashboard',
    }, 'Go to Members tab to approve or reject this application.')
  );
}

export async function notifyNewDonation(data: { fullName: string; amount: number; currency: string; method: string; phone: string }) {
  await sendToAdmin(
    `💛 New Donation: ${data.currency} ${data.amount} from ${data.fullName}`,
    xtsEmail('New Donation Received', {
      'Donor': data.fullName,
      'Amount': `${data.currency} ${data.amount.toLocaleString()}`,
      'Method': data.method,
      'Phone': data.phone,
      'Status': 'PENDING — Confirm in Donations tab',
    }, 'Go to Donations tab and confirm once you verify the payment.')
  );
}

export async function notifyNewComplaint(data: { fullName: string; city: string; subject: string; category: string }) {
  await sendToAdmin(
    `🔴 New Complaint: ${data.subject}`,
    xtsEmail('New Citizen Complaint', {
      'From': data.fullName,
      'City': data.city,
      'Category': data.category,
      'Subject': data.subject,
    }, 'Go to Complaints tab to read the full complaint and update its status.')
  );
}

export async function notifyNewMessage(data: { name: string; email: string; subject: string }) {
  await sendToAdmin(
    `✉️ New Contact Message: ${data.subject}`,
    xtsEmail('New Contact Message', {
      'From': data.name,
      'Email': data.email,
      'Subject': data.subject,
    }, 'Go to Messages tab to read and reply.')
  );
}

export async function notifyNewVolunteer(data: { firstName: string; lastName: string; phone: string; city: string; type: string }) {
  await sendToAdmin(
    `🙋 New ${data.type === 'CANVASSER' ? 'Canvasser' : 'Volunteer'}: ${data.firstName} ${data.lastName}`,
    xtsEmail('New Volunteer Application', {
      'Name': `${data.firstName} ${data.lastName}`,
      'Phone': data.phone,
      'City': data.city,
      'Type': data.type,
    }, 'Go to Volunteers tab to approve or assign this volunteer.')
  );
}

export async function notifyNewRSVP(data: { name: string; phone: string; eventTitle: string }) {
  await sendToAdmin(
    `📅 Event RSVP: ${data.name} for "${data.eventTitle}"`,
    xtsEmail('New Event RSVP', {
      'Name': data.name,
      'Phone': data.phone,
      'Event': data.eventTitle,
    })
  );
}
