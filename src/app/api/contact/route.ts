import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    if (!validateEmail(email))
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });

    if (message.length < 10)
      return NextResponse.json({ error: 'Message too short' }, { status: 400 });

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;

    if (!user || !pass)
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });

    // Create transporter inside handler so env vars are always resolved
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    // Email to you
    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to: user,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:monospace;background:#0a0e17;color:#e2e8f0;padding:24px;border-radius:8px">
          <h2 style="color:#00e5ff;margin:0 0 16px">New Portfolio Transmission</h2>
          <p><span style="color:#94a3b8">From:</span> ${escapeHtml(name)}</p>
          <p><span style="color:#94a3b8">Email:</span> ${escapeHtml(email)}</p>
          <hr style="border-color:#1e293b;margin:16px 0">
          <p style="color:#94a3b8;margin-bottom:8px">Message:</p>
          <pre style="background:#1e293b;padding:12px;border-radius:6px;white-space:pre-wrap">${escapeHtml(message)}</pre>
          <p style="color:#64748b;font-size:12px;margin-top:16px">Hit reply to respond directly to ${escapeHtml(name)}</p>
        </div>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Joshua Silva" <${user}>`,
      to: email,
      subject: 'Message received — Joshua Silva',
      html: `
        <div style="font-family:monospace;background:#0a0e17;color:#e2e8f0;padding:24px;border-radius:8px">
          <h2 style="color:#00e5ff;margin:0 0 16px">Transmission Received</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Got your message — I'll get back to you within 24 hours.</p>
          <hr style="border-color:#1e293b;margin:16px 0">
          <p style="color:#64748b;font-size:12px">Your message:</p>
          <pre style="background:#1e293b;padding:12px;border-radius:6px;color:#94a3b8;white-space:pre-wrap">${escapeHtml(message)}</pre>
          <p style="margin-top:16px">— Joshua Silva<br><span style="color:#00e5ff">Full Stack Developer</span></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact form error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
