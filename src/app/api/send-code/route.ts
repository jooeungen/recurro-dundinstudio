import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PLATFORMS = ['ios', 'android'] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

type ErrorCode =
  | 'INVALID_EMAIL'
  | 'INVALID_PLATFORM'
  | 'INVALID_COUPON'
  | 'COUPON_EXPIRED'
  | 'ALREADY_CLAIMED'
  | 'NO_CODES_LEFT'
  | 'EMAIL_SEND_FAILED';

function errorResponse(code: ErrorCode, status: number) {
  return NextResponse.json({ error: code }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email ?? '').trim().toLowerCase();
    const platform = (body.platform ?? '').trim().toLowerCase();
    const coupon = (body.coupon ?? '').trim().toUpperCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      return errorResponse('INVALID_EMAIL', 400);
    }

    if (!VALID_PLATFORMS.includes(platform as Platform)) {
      return errorResponse('INVALID_PLATFORM', 400);
    }

    if (!coupon) {
      return errorResponse('INVALID_COUPON', 400);
    }

    // Lookup campaign
    const campaign = await kv.get<{ expiresAt: string }>(`campaign:${coupon}`);
    if (!campaign) {
      return errorResponse('INVALID_COUPON', 404);
    }

    // Check expiration
    if (new Date(campaign.expiresAt) < new Date()) {
      return errorResponse('COUPON_EXPIRED', 410);
    }

    // Check if email already received a code for this coupon
    const TEST_EMAILS = ['jooeungen@gmail.com'];
    if (!TEST_EMAILS.includes(email)) {
      const alreadyClaimed = await kv.sismember(`codes:emails:${coupon}`, email);
      if (alreadyClaimed) {
        return errorResponse('ALREADY_CLAIMED', 409);
      }
    }

    // Atomically pop an available code from the coupon+platform pool
    const code = await kv.spop<string>(`codes:${coupon}:${platform}:available`);
    if (!code) {
      return errorResponse('NO_CODES_LEFT', 410);
    }

    const platformLabel = platform === 'ios' ? 'iOS' : 'Android';

    // Send email via Resend
    const { error: sendError } = await getResend().emails.send({
      from: 'Recurro <noreply@dundinstudio.com>',
      to: email,
      subject: `Your Recurro Redeem Code (${platformLabel})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Recurro</h1>
          <p style="font-size: 16px; color: #555; margin-bottom: 32px;">Here is your redeem code for <strong>${platformLabel}</strong>:</p>
          <div style="background: linear-gradient(135deg, #6366f1, #a855f7); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <span style="font-size: 18px; font-weight: 700; color: #fff; letter-spacing: 2px; word-break: break-all;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #888; line-height: 1.6;">
            This code is unique to you. Please keep it safe.<br/>
            If you have any questions, reply to this email.
          </p>
          <div style="border-top: 1px solid #eee; margin: 32px 0;"></div>
          <p style="font-size: 12px; color: #aaa;">DUNDIN STUDIO</p>
        </div>
      `,
    });

    if (sendError) {
      console.error('[send-code] Resend error:', sendError);
      // Return code to available set if email failed
      await kv.sadd(`codes:${coupon}:${platform}:available`, code);
      return errorResponse('EMAIL_SEND_FAILED', 502);
    }

    // Record assignment and mark email as claimed
    await Promise.all([
      kv.set(`codes:assigned:${code}`, JSON.stringify({
        email,
        platform,
        coupon,
        sentAt: new Date().toISOString(),
      })),
      kv.sadd(`codes:emails:${coupon}`, email),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[send-code] Error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
