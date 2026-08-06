import { campaignFor } from './campaign.mjs';

/* Ordinary outbound links and Typeform popups use the same campaign values;
   utm_content distinguishes each individual placement. */
const tagged = (base, { content, ...extra }) => {
  const url = new URL(base);
  const params = { ...campaignFor(content), ...extra };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  return url.toString();
};

export const MLH_URL = tagged('https://mlh.com', { content: 'partner-mlh' });

export const DEV_URL = tagged('https://dev.to', { content: 'partner-dev' });

export const DIGITALOCEAN_URL = tagged('https://www.digitalocean.com', {
  content: 'partner-digitalocean',
});
