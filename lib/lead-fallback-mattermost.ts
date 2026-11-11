export interface FallbackLeadPayload {
  name: string;
  email: string;
  phone: string;
  phoneCountry?: string;
  business?: string;
  companyWebsite?: string;
  message?: string;
  companySize?: string;
  positions?: string;
  referral?: string;
  source?: string;
  pageUrl: string;
  userAgent?: string;
}

export async function sendLeadFallbackToMattermost(lead: FallbackLeadPayload): Promise<boolean> {
  // ACR alone owns lead notifications. Never send directly to Mattermost.
  return false;
}
