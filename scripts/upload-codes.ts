import 'dotenv/config';
import { createClient } from '@vercel/kv';
import { readFileSync } from 'fs';

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const VALID_PLATFORMS = ['ios', 'android'] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

function parseArg(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function parsePlatform(args: string[]): Platform {
  const value = parseArg(args, '--platform');
  if (!value) {
    console.error('Error: --platform <ios|android> is required.');
    process.exit(1);
  }
  const lower = value.toLowerCase();
  if (!VALID_PLATFORMS.includes(lower as Platform)) {
    console.error(`Error: Invalid platform "${value}". Must be "ios" or "android".`);
    process.exit(1);
  }
  return lower as Platform;
}

function parseCoupon(args: string[]): string {
  const value = parseArg(args, '--coupon');
  if (!value) {
    console.error('Error: --coupon <COUPON_CODE> is required.');
    process.exit(1);
  }
  return value.toUpperCase();
}

async function ensureCampaign(coupon: string, expires: string | undefined) {
  const existing = await kv.get<{ expiresAt: string }>(`campaign:${coupon}`);

  if (!existing && !expires) {
    console.error(`Error: Campaign "${coupon}" does not exist. Provide --expires YYYY-MM-DD to create it.`);
    process.exit(1);
  }

  if (!existing) {
    // Create new campaign
    await kv.set(`campaign:${coupon}`, JSON.stringify({ expiresAt: `${expires}T23:59:59.999Z` }));
    console.log(`Created campaign "${coupon}" (expires: ${expires})`);
  } else if (expires) {
    // Update expiry
    await kv.set(`campaign:${coupon}`, JSON.stringify({ expiresAt: `${expires}T23:59:59.999Z` }));
    console.log(`Updated campaign "${coupon}" expiry to ${expires}`);
  } else {
    console.log(`Campaign "${coupon}" exists (expires: ${existing.expiresAt})`);
  }
}

async function uploadCodes(coupon: string, platform: Platform, codes: string[]) {
  const unique = [...new Set(codes.map((c) => c.trim()).filter(Boolean))];
  if (unique.length === 0) {
    console.log('No codes to upload.');
    return;
  }

  const key = `codes:${coupon}:${platform}:available`;
  const added = await kv.sadd(key, ...(unique as [string, ...string[]]));
  console.log(`[${coupon}:${platform}] Uploaded ${added} new codes (${unique.length} provided, duplicates skipped).`);
}

async function showStats() {
  // Scan for all campaign keys
  const campaigns: string[] = [];
  let done = false;
  let scanCursor = 0;
  while (!done) {
    const [next, keys]: [string, string[]] = await kv.scan(scanCursor, { match: 'campaign:*', count: 100 });
    campaigns.push(...keys);
    scanCursor = Number(next);
    if (next === '0' || scanCursor === 0) done = true;
  }

  if (campaigns.length === 0) {
    console.log('No campaigns found.');
    return;
  }

  console.log('--- Campaign Stats ---\n');

  for (const key of campaigns.sort()) {
    const coupon = key.replace('campaign:', '');
    const campaign = await kv.get<{ expiresAt: string }>(key);
    const expired = campaign && new Date(campaign.expiresAt) < new Date();

    const [iosAvailable, androidAvailable, claimed] = await Promise.all([
      kv.scard(`codes:${coupon}:ios:available`),
      kv.scard(`codes:${coupon}:android:available`),
      kv.scard(`codes:emails:${coupon}`),
    ]);

    console.log(`Campaign: ${coupon}`);
    console.log(`  Expires:           ${campaign?.expiresAt ?? 'N/A'}${expired ? ' (EXPIRED)' : ''}`);
    console.log(`  iOS available:     ${iosAvailable}`);
    console.log(`  Android available: ${androidAvailable}`);
    console.log(`  Total available:   ${iosAvailable + androidAvailable}`);
    console.log(`  Claimed emails:    ${claimed}`);
    console.log();
  }
}

async function migrate() {
  const coupon = 'LUNAR_RECURRO';
  const expires = '2026-02-28';

  // Create campaign
  await kv.set(`campaign:${coupon}`, JSON.stringify({ expiresAt: `${expires}T23:59:59.999Z` }));
  console.log(`Created campaign "${coupon}" (expires: ${expires})`);

  // Move Android codes
  for (const platform of VALID_PLATFORMS) {
    const oldKey = `codes:${platform}:available`;
    const newKey = `codes:${coupon}:${platform}:available`;

    // Get all codes from old key
    const codes = await kv.smembers<string[]>(oldKey);
    if (codes.length > 0) {
      await kv.sadd(newKey, ...(codes as [string, ...string[]]));
      await kv.del(oldKey);
      console.log(`[${platform}] Migrated ${codes.length} codes to ${newKey}`);
    } else {
      console.log(`[${platform}] No codes to migrate from ${oldKey}`);
    }
  }

  // Move emails
  const oldEmailKey = 'codes:emails';
  const newEmailKey = `codes:emails:${coupon}`;
  const emails = await kv.smembers<string[]>(oldEmailKey);
  if (emails.length > 0) {
    await kv.sadd(newEmailKey, ...(emails as [string, ...string[]]));
    await kv.del(oldEmailKey);
    console.log(`Migrated ${emails.length} claimed emails to ${newEmailKey}`);
  } else {
    console.log('No claimed emails to migrate.');
  }

  console.log('\nMigration complete!');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--stats')) {
    await showStats();
    return;
  }

  if (args.includes('--migrate')) {
    await migrate();
    return;
  }

  const coupon = parseCoupon(args);
  const platform = parsePlatform(args);
  const expires = parseArg(args, '--expires');

  await ensureCampaign(coupon, expires);

  if (args.includes('--inline')) {
    const raw = parseArg(args, '--inline');
    if (!raw) {
      console.error('Usage: --inline "CODE1,CODE2,CODE3"');
      process.exit(1);
    }
    const codes = raw.split(',');
    await uploadCodes(coupon, platform, codes);
    return;
  }

  // Default: treat remaining arg as file path
  const skipFlags = new Set(['--platform', '--coupon', '--expires', '--inline']);
  const filePath = args.find((a, i) => {
    if (a.startsWith('--')) return false;
    // Skip values that follow a flag
    if (i > 0 && skipFlags.has(args[i - 1])) return false;
    return true;
  });

  if (!filePath) {
    console.error(
      'Usage:\n' +
        '  npx tsx scripts/upload-codes.ts --coupon LUNAR_RECURRO --platform android --expires 2026-02-28 --inline "CODE1,CODE2"\n' +
        '  npx tsx scripts/upload-codes.ts --coupon LUNAR_RECURRO --platform ios path/to/codes.csv\n' +
        '  npx tsx scripts/upload-codes.ts --stats\n' +
        '  npx tsx scripts/upload-codes.ts --migrate',
    );
    process.exit(1);
  }

  const content = readFileSync(filePath, 'utf-8');
  const codes = content
    .split(/[\n,]/)
    .map((c) => c.trim())
    .filter(Boolean);
  await uploadCodes(coupon, platform, codes);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
