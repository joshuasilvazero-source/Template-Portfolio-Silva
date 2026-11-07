import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { normalizeInquiry, validateInquiry, type Inquiry } from '@/lib/inquiry';
import { plans } from '@/content/maintenance';
import { site } from '@/content/site';

/**
 * Project inquiry endpoint. Sends the inquiry to your inbox through Gmail SMTP
 * (EMAIL_USER / EMAIL_PASSWORD — a Google App Password, never your real password).
 *
 * Spam protection: hidden honeypot field, minimum fill time, per-IP rate limit,
 * strict validation, and a payload size cap. The rate limit is in-memory, so it
 * is best-effort on serverless (each instance keeps its own counter). If spam
 * becomes a problem, add Cloudflare Turnstile or Vercel BotID.
 */

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16_000;
const MIN_FILL_MS = 3_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear(); // keep memory bounded
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]!);

/** Strip CR/LF so user input can never inject email headers. */
const oneLine = (text: string) => text.replace(/[\r\n]+/g, ' ').slice(0, 150);

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 16px 6px 0;color:#5b6573;vertical-align:top">${label}</td><td style="padding:6px 0;color:#1b2430">${
    value ? escapeHtml(value) : '<span style="color:#a9b3bf">—</span>'
  }</td></tr>`;
}

function ownerEmail(d: Inquiry) {
  const planName = plans.find(p => p.id === d.plan)?.name ?? '';
  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;color:#1b2430">
    <h2 style="margin:0 0 4px">New project inquiry</h2>
    <p style="margin:0 0 20px;color:#5b6573">Reply to this email to respond to ${escapeHtml(d.name)} directly.</p>
    <table style="border-collapse:collapse;font-size:14px">
      ${row('Name', d.name)}
      ${row('Business', d.business)}
      ${row('Email', d.email)}
      ${row('Website', d.website)}
      ${row('Service', d.service)}
      ${row('Plan requested', planName)}
      ${row('Budget', d.budget)}
      ${row('Timeline', d.timeline)}
      ${row('Care plan interest', d.care)}
    </table>
    <h3 style="margin:24px 0 8px;font-size:15px">Project description</h3>
    <div style="white-space:pre-wrap;background:#f3f5f7;padding:16px;border-radius:8px;font-size:14px;line-height:1.6">${escapeHtml(d.message)}</div>
  </div>`;
}

/** Deliberately does NOT echo the visitor's message, so the form can't be used to relay spam. */
function confirmationEmail(name: string) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;color:#1b2430;line-height:1.6">
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thanks for reaching out. I have your project inquiry and will reply within ${site.responseTime} (${site.hours}).</p>
    <p>If anything changes in the meantime, just reply to this email.</p>
    <p>— ${site.name}<br><span style="color:#5b6573">${site.businessName}</span></p>
    <p style="font-size:12px;color:#5b6573">You are receiving this because this address was entered on the contact form at ${escapeHtml(site.url)}. If that was not you, you can ignore this email.</p>
  </div>`;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'The message is too long.' }, { status: 413 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('not an object');
  } catch {
    return NextResponse.json({ error: 'The form data could not be read. Refresh the page and try again.' }, { status: 400 });
  }

  // Honeypot or too-fast submission: pretend success so bots learn nothing.
  const elapsed = Number(raw.elapsed ?? 0);
  if ((typeof raw.fax === 'string' && raw.fax.trim() !== '') || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ success: true });
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many messages were sent from this connection. Wait a few minutes and try again.' },
      { status: 429 },
    );
  }

  const data = normalizeInquiry(raw);
  const fields = validateInquiry(data);
  if (Object.keys(fields).length) {
    return NextResponse.json({ error: 'Some fields need attention.', fields }, { status: 400 });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  if (!user || !pass) {
    console.error('Contact form: EMAIL_USER / EMAIL_PASSWORD are not set.');
    return NextResponse.json({ error: 'The contact form is temporarily unavailable.' }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Website inquiry" <${user}>`,
      to: process.env.INQUIRY_TO || user,
      replyTo: data.email,
      subject: oneLine(`Inquiry: ${data.service} — ${data.name}${data.business ? ` (${data.business})` : ''}`),
      html: ownerEmail(data),
    });
  } catch (error) {
    console.error('Contact form: send failed —', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'The message could not be sent right now.' }, { status: 502 });
  }

  // Confirmation is best-effort; the inquiry already reached you.
  try {
    await transporter.sendMail({
      from: `"${site.name}" <${user}>`,
      to: data.email,
      subject: 'I received your project inquiry',
      html: confirmationEmail(data.name),
    });
  } catch (error) {
    console.error('Contact form: confirmation failed —', error instanceof Error ? error.message : error);
  }

  return NextResponse.json({ success: true });
}
