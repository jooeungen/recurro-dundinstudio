import 'dotenv/config';
import { Resend } from 'resend';

const emailContent = {
  en: {
    subject: (platformLabel: string) => `Your Recurro Redeem Code (${platformLabel})`,
    intro: (platformLabel: string) => `Here is your redeem code for <strong>${platformLabel}</strong>:`,
    copyHint: 'Long press the code to copy',
    redeemNow: 'Redeem Now',
    downloadIOS: 'Download Recurro for iOS',
    downloadAndroid: 'Download Recurro for Android',
    catchPhrase: 'Never miss important recurring tasks again',
    websiteUrl: 'https://recurro.dundinstudio.com/en',
    howToTitle: 'Or enter your code manually',
    iosSteps: [
      'Open the <strong>App Store</strong>',
      'Tap your profile icon (top right)',
      'Tap <strong>Redeem Gift Card or Code</strong>',
      'Tap <strong>Enter Code Manually</strong> and paste your code',
    ],
    androidSteps: [
      'Open the <strong>Google Play Store</strong>',
      'Tap the profile icon (top right)',
      'Tap <strong>Payments &amp; subscriptions</strong> &rarr; <strong>Redeem code</strong>',
      'Paste your code and confirm',
    ],
    keepSafe: 'This code is unique to you. Please keep it safe.',
    questions: 'Need help? Contact us at',
  },
};

const IOS_LINK = 'https://apps.apple.com/us/app/recurro/id6748042726';
const ANDROID_LINK = 'https://play.google.com/store/apps/details?id=com.dundinstudio.recurro';

function getRedeemLink(platform: string, code: string) {
  if (platform === 'ios') {
    return `https://apps.apple.com/redeem?ctx=offercodes&id=6748042726&code=${code}`;
  }
  return `https://play.google.com/redeem?code=${code}`;
}

function buildEmailHtml(platform: string, code: string) {
  const t = emailContent.en;
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
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
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

async function main() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const platform = 'ios';
  const code = 'FAKE-TEST-CODE-1234';
  const html = buildEmailHtml(platform, code);
  const t = emailContent.en;

  const { data, error } = await resend.emails.send({
    from: 'Recurro <noreply@dundinstudio.com>',
    to: 'jooeungen@gmail.com',
    subject: t.subject('iOS'),
    html,
  });

  if (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
  console.log('Test email sent!', data);
}

main();
