'use server';

const SITE_ID = 'hire-offshore-teams';

export interface FallbackLeadPayload {
  name: string;
  email: string;
  phone: string;
  business?: string;
  message?: string;
  companySize?: string;
  positions?: string;
  referral?: string;
  pageUrl: string;
  userAgent?: string;
}

export async function sendLeadFallbackToMattermost(lead: FallbackLeadPayload): Promise<boolean> {
  const fallbackWebhook = process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
  if (!fallbackWebhook) {
    console.warn('[lead-fallback] Mattermost fallback is not configured');
    return false;
  }
  try {
    if (looksLikeGarbagePiiLead(lead)) {
      console.warn('[lead-fallback] garbage_pii_lead_submit; site-direct dropped');
      return false;
    }
    const lines = [
      `**[SITE-DIRECT:${SITE_ID}] New lead - ${escapeMd(lead.name || lead.email || lead.phone || 'unknown')}**`,
      `_Submitted by the site's independent fallback because primary delivery failed_`,
      '', '| Field | Value |', '|---|---|',
      `| Site | ${escapeMd(SITE_ID)} |`,
      `| Name | ${escapeMd(lead.name) || '_(empty)_'} |`,
      `| Email | ${escapeMd(lead.email) || '_(empty)_'} |`,
      `| Phone | ${escapeMd(lead.phone) || '_(empty)_'} |`,
      `| Business | ${escapeMd(lead.business) || '-'} |`,
      `| Company size | ${escapeMd(lead.companySize) || '-'} |`,
      `| Positions | ${escapeMd(lead.positions) || '-'} |`,
      `| Referral | ${escapeMd(lead.referral) || '-'} |`,
      `| Page | ${escapeMd(lead.pageUrl) || '-'} |`,
      `| Time | ${new Date().toISOString()} |`,
      '',
      lead.message ? `**Message:**\n> ${escapeMd(lead.message).replace(/\n/g, '\n> ')}` : '',
    ].filter(Boolean);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    try {
      const response = await fetch(fallbackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lines.join('\n'), username: `${SITE_ID} Direct (fallback)`, icon_emoji: ':warning:' }),
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!response.ok) {
        console.error('[lead-fallback] Mattermost rejected fallback delivery');
        return false;
      }
      return true;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    // Deliberately omit the error object because fetch errors can contain the secret webhook URL.
    console.error('[lead-fallback] fallback delivery failed');
    return false;
  }
}

function escapeMd(value: string | undefined): string {
  if (!value) return '';
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r?\n/g, ' ')
    .replace(/@/g, '@\u200B')
    .replace(/[|`*_\\>[\]()~#]/g, (character) => `\\${character}`)
    .slice(0, 1_000);
}

function looksRandomAlphanumeric(value: string): boolean {
  if (!value || /\s/.test(value) || !/^[A-Za-z0-9]+$/.test(value)) return false;
  const letters = value.match(/[A-Za-z]/g) ?? [];
  let caseTransitions = 0;
  for (let index = 1; index < value.length; index += 1) {
    const previous = value[index - 1];
    const current = value[index];
    if (/[A-Za-z]/.test(previous) && /[A-Za-z]/.test(current) && (previous === previous.toUpperCase()) !== (current === current.toUpperCase())) caseTransitions += 1;
  }
  const chaoticCase = value.length >= 8 && caseTransitions >= 4;
  let extremeVowelRatio = false;
  if (value.length >= 12 && letters.length >= 8) {
    const vowels = letters.filter((letter) => 'aeiouAEIOU'.includes(letter)).length;
    const vowelRatio = vowels / letters.length;
    extremeVowelRatio = vowelRatio < 0.25 || vowelRatio > 0.55;
  }
  return extremeVowelRatio || chaoticCase;
}

function looksLikeGarbagePiiLead(lead: FallbackLeadPayload): boolean {
  return looksRandomAlphanumeric((lead.name || '').trim()) && looksRandomAlphanumeric((lead.message || '').trim());
}
