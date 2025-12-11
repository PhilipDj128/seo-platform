import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('📧 API: POST /api/send-email - Starting...');

    const body = await request.json();
    const { type, to, domain, package: pkg } = body;

    console.log('📝 Email type:', type);
    console.log('📬 Recipient:', to);

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const emailContent =
      type === 'reminder'
        ? {
            subject: `Påminnelse: Din SEO-offert för ${domain}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Hej! 👋</h2>
                <p>Vi ville bara påminna dig om din SEO-offert för <strong>${domain}</strong>.</p>
                <p><strong>Paket:</strong> ${pkg.toUpperCase()}</p>
                <p>Har du några frågor? Kontakta oss gärna!</p>
                <hr />
                <p style="color: #666; font-size: 12px;">Mvh, SEO Platform Team</p>
              </div>
            `,
          }
        : {
            subject: `Din SEO-offert för ${domain}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Tack för ditt intresse! 🎉</h2>
                <p>Vi har mottagit din offertförfrågan för <strong>${domain}</strong>.</p>
                <p><strong>Paket:</strong> ${pkg.toUpperCase()}</p>
                <p>Vi kontaktar dig snart med mer detaljer!</p>
                <hr />
                <p style="color: #666; font-size: 12px;">Mvh, SEO Platform Team</p>
              </div>
            `,
          };

    console.log('📤 Sending email via Resend...');
    const data = await resend.emails.send({
      from: 'SEO Platform <onboarding@resend.dev>',
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('✅ Email sent:', data);

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        to: to,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
