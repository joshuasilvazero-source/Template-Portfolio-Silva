import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 },
      );
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: Courier New, monospace; color: #0a0e27;">
          <h2 style="color: #00ffff;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <hr style="border-color: #00ffff; opacity: 0.3;">
          <p><strong>Message:</strong></p>
          <pre style="background-color: #1a1f3a; padding: 10px; border-radius: 5px; overflow-x: auto;">
${escapeHtml(message)}
          </pre>
          <hr style="border-color: #00ffff; opacity: 0.3;">
          <p style="color: #999; font-size: 12px;">
            Reply directly to this email to contact ${escapeHtml(name)}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thanks for reaching out! - Joshua Silva',
      html: `
        <div style="font-family: Courier New, monospace; color: #0a0e27;">
          <h2 style="color: #00ffff;">Thanks for Your Message!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>I received your message and will get back to you as soon as possible.</p>
          <hr style="border-color: #00ffff; opacity: 0.3;">
          <p style="color: #999; font-size: 12px;">
            This is an automated response. The actual message was:
          </p>
          <pre style="background-color: #1a1f3a; padding: 10px; border-radius: 5px; overflow-x: auto; color: #00ffff;">
${escapeHtml(message)}
          </pre>
          <hr style="border-color: #00ffff; opacity: 0.3;">
          <p>Best regards,<br/>Joshua Silva</p>
        </div>
      `,
    };

    await transporter.sendMail(confirmationEmail);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 },
    );
  }
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
