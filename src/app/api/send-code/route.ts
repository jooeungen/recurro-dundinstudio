import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendEmail(to: string, subject: string, html: string): Promise<string | null> {
  // Try Resend first
  const { error: resendError } = await getResend().emails.send({
    from: 'Recurro <noreply@dundinstudio.com>',
    to,
    subject,
    html,
  });

  if (!resendError) return null;

  console.warn('[send-code] Resend failed, trying SendGrid fallback:', resendError);

  // Fallback to SendGrid
  if (!process.env.SENDGRID_API_KEY) {
    return resendError.message ?? 'Resend failed and no SendGrid fallback configured';
  }

  try {
    await sgMail.send({ from: 'Recurro <noreply@dundinstudio.com>', to, subject, html });
    return null;
  } catch (sgError) {
    console.error('[send-code] SendGrid fallback also failed:', sgError);
    return 'Both Resend and SendGrid failed';
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PLATFORMS = ['ios', 'android'] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const IOS_LINK = 'https://apps.apple.com/us/app/recurro/id6748042726';
const ANDROID_LINK = 'https://play.google.com/store/apps/details?id=com.dundinstudio.recurro';

const emailContent = {
  en: {
    subject: (platformLabel: string) => `Your Recurro Redeem Code (${platformLabel})`,
    intro: (platformLabel: string) => `Here is your redeem code for <strong>${platformLabel}</strong>:`,
    copyHint: 'Long press the code to copy',
    redeemNow: 'Redeem Now',
    downloadApp: 'Download Recurro',
    downloadIOS: 'Download Recurro for iOS',
    downloadAndroid: 'Download Recurro for Android',
    catchPhrase: 'Never miss important recurring tasks again',
    websiteUrl: 'https://recurro.dundinstudio.com/en',
    howToTitle: 'Or enter your code manually',
    iosSteps: [
      'Open the <strong>App Store</strong> app',
      'Tap your profile icon (top right)',
      'Tap <strong>Redeem Gift Card or Code</strong>',
      'Tap <strong>Enter Code Manually</strong>',
      'Enter the code!',
    ],
    androidSteps: [
      'Open the <strong>Google Play Store</strong> app',
      'Tap the profile icon (top right)',
      'Tap <strong>Payments & subscriptions</strong> → <strong>Redeem code</strong>',
      'Enter the code!',
    ],
    keepSafe: 'This code is unique to you. Please keep it safe.',
    questions: 'Need help? Contact us at',
  },
  ko: {
    subject: (platformLabel: string) => `Recurro 리딤 코드 (${platformLabel})`,
    intro: (platformLabel: string) => `<strong>${platformLabel}</strong> 리딤 코드입니다:`,
    copyHint: '코드를 길게 눌러 복사하세요',
    redeemNow: '바로 등록하기',
    downloadApp: 'Recurro 다운로드',
    downloadIOS: 'Recurro iOS 다운로드',
    downloadAndroid: 'Recurro Android 다운로드',
    catchPhrase: '중요한 반복 할 일, 다시는 놓치지 마세요',
    websiteUrl: 'https://recurro.dundinstudio.com/ko',
    howToTitle: '또는 직접 코드 입력하기',
    iosSteps: [
      '<strong>App Store</strong> 앱 열기',
      '프로필 아이콘 클릭 (우 상단)',
      '<strong>기프트 카드 또는 코드 사용</strong> 클릭',
      '<strong>수동으로 코드 입력</strong> 클릭',
      '코드 입력!',
    ],
    androidSteps: [
      '<strong>Google Play Store</strong> 앱 열기',
      '프로필 아이콘 클릭 (우 상단)',
      '<strong>결제 & 구독</strong> 클릭 → <strong>리딤코드</strong> 클릭',
      '코드 입력!',
    ],
    keepSafe: '이 코드는 회원님만을 위한 코드입니다. 안전하게 보관해주세요.',
    questions: '도움이 필요하신가요?',
  },
} as const;

function getRedeemLink(platform: string, code: string) {
  if (platform === 'ios') {
    return `https://apps.apple.com/redeem?ctx=offercodes&id=6748042726&code=${code}`;
  }
  return `https://play.google.com/redeem?code=${code}`;
}

function buildEmailHtml(platform: string, code: string, locale: string) {
  const t = locale === 'ko' ? emailContent.ko : emailContent.en;
  const platformLabel = platform === 'ios' ? 'iOS' : 'Android';
  const downloadLink = platform === 'ios' ? IOS_LINK : ANDROID_LINK;
  const downloadLabel = platform === 'ios' ? t.downloadIOS : t.downloadAndroid;
  const redeemLink = getRedeemLink(platform, code);
  const steps = platform === 'ios' ? t.iosSteps : t.androidSteps;
  const platformName = platform === 'ios' ? 'iOS' : 'Android';

  const stepsRows = steps
    .map(
      (s, i) =>
        `<tr><td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #4a4a5a; line-height: 1.7; padding-bottom: 4px;" valign="top">${i + 1}. ${s}</td></tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${locale === 'ko' ? 'ko' : 'en'}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Recurro</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
    body{margin:0;padding:0;width:100%!important;height:100%!important}
    @media (prefers-color-scheme:dark){
      .email-bg{background-color:#1a1a2e!important}
      .card-bg{background-color:#16213e!important}
      .text-primary{color:#f0f0f5!important}
      .text-secondary{color:#b0b0c0!important}
      .text-muted{color:#888899!important}
      .divider{border-color:#2a2a4a!important}
      .code-box{background-color:#2d1b69!important}
      .step-box{background-color:#1e1e3a!important;border-color:#2a2a4a!important}
    }
    @media only screen and (max-width:600px){
      .email-container{width:100%!important;max-width:100%!important}
      .cta-button a{width:100%!important;display:block!important}
      .mobile-padding{padding-left:20px!important;padding-right:20px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f8;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f4f4f8;">${t.intro(platformLabel)}&#847;&zwnj;&nbsp;</div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f8;" class="email-bg">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px 40px;border-bottom:1px solid #eeeef2;" class="mobile-padding">
              <h1 style="margin:0 0 6px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#1a1a2e;letter-spacing:-0.3px;" class="text-primary">Recurro</h1>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;color:#9b9bab;line-height:1.4;" class="text-muted">${t.catchPhrase}</p>
            </td>
          </tr>
          <!-- Hero -->
          <tr>
            <td style="padding:40px 40px 16px 40px;" class="mobile-padding">
              <p style="margin:0 0 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;color:#6b6b80;line-height:1.6;" class="text-secondary">${t.intro(platformLabel)}</p>
              <!-- Primary CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="cta-button" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${redeemLink}" style="height:56px;v-text-anchor:middle;width:100%;" arcsize="50%" fillcolor="#6c3ce0">
                      <w:anchorlock/><center style="color:#ffffff;font-family:sans-serif;font-size:17px;font-weight:bold;">${t.redeemNow}</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${redeemLink}" target="_blank" style="display:block;padding:16px 32px;background-color:#6c3ce0;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:17px;font-weight:700;text-decoration:none;text-align:center;border-radius:28px;line-height:1.4;mso-hide:all;">${t.redeemNow}</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Secondary CTA -->
          <tr>
            <td style="padding:0 40px 40px 40px;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top:12px;">
                    <a href="${downloadLink}" target="_blank" style="display:inline-block;padding:12px 28px;border:1.5px solid #d0d0dd;color:#1a1a2e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;text-align:center;border-radius:24px;line-height:1.4;">${downloadLabel}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="border-top:1px solid #eeeef2;" class="divider">&nbsp;</td></tr></table>
            </td>
          </tr>
          <!-- Manual Fallback -->
          <tr>
            <td style="padding:32px 40px 40px 40px;" class="mobile-padding">
              <p style="margin:0 0 20px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#6b6b80;" class="text-secondary">${t.howToTitle}</p>
              <!-- Code box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:8px;">
                <tr>
                  <td align="center" class="code-box" style="background-color:#f0ecfb;border-radius:12px;padding:20px 24px;">
                    <p style="margin:0;font-family:'SF Mono','Fira Code','Roboto Mono','Courier New',monospace;font-size:20px;font-weight:700;color:#6c3ce0;letter-spacing:2.5px;word-break:break-all;-webkit-user-select:all;user-select:all;">${code}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 28px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#9b9bab;text-align:center;" class="text-muted">${t.copyHint}</p>
              <!-- Steps -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="step-box">
                <tr>
                  <td style="background-color:#f8f8fb;border:1px solid #eeeef2;border-radius:12px;padding:20px 24px;">
                    <p style="margin:0 0 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;" class="text-primary">${platformName}</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">${stepsRows}</table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:0 40px;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="border-top:1px solid #eeeef2;" class="divider">&nbsp;</td></tr></table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 36px 40px;" class="mobile-padding">
              <p style="margin:0 0 8px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;color:#9b9bab;line-height:1.6;" class="text-muted">${t.keepSafe}</p>
              <p style="margin:0 0 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;color:#9b9bab;line-height:1.6;" class="text-muted">${t.questions} <a href="mailto:admin@dundinstudio.com" style="color:#6c3ce0;text-decoration:underline;">admin@dundinstudio.com</a></p>
              <p style="margin:0 0 20px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;color:#9b9bab;line-height:1.6;" class="text-muted"><a href="${t.websiteUrl}" target="_blank" style="color:#6c3ce0;text-decoration:underline;">${t.websiteUrl}</a></p>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#c0c0cc;letter-spacing:0.5px;" class="text-muted">DUNDIN STUDIO</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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
    const locale = (body.locale ?? 'en').trim().toLowerCase();

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
    const t = locale === 'ko' ? emailContent.ko : emailContent.en;

    // Send email (Resend first, SendGrid fallback)
    const sendError = await sendEmail(email, t.subject(platformLabel), buildEmailHtml(platform, code, locale));

    if (sendError) {
      console.error('[send-code] Email send failed:', sendError);
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
