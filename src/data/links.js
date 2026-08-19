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

export const MLH_ACCOUNT_URL = tagged('https://www.mlh.com/account/profile', {
  content: 'my-manage-account',
});

export const MLH_ADDRESS_URL = tagged(
  'https://www.mlh.com/account/settings#addresses',
  { content: 'my-add-address' },
);

/* Where /auth/callback/ sends someone whose MyMLH account shared no email
   address. Confirmed with MLH: the settings page owns the email, the same
   page MLH_ADDRESS_URL points at (it deep-links the #addresses section).
   Its own constant regardless, so the utm_content still names the placement
   it came from. */
export const MLH_EMAIL_URL = tagged('https://www.mlh.com/account/settings', {
  content: 'auth-add-email',
});

export const DEV_URL = tagged('https://dev.to', { content: 'partner-dev' });

export const DIGITALOCEAN_URL = tagged('https://www.digitalocean.com', {
  content: 'partner-digitalocean',
});

/* The Fest hosting guide has no published home yet. Reserved-TLD
   placeholder, the same convention the activity links use: it can never
   resolve, and the guard in host-page.test.mjs fails the moment a real URL
   arrives — forcing a deliberate swap instead of a silent one. */
export const HOST_GUIDE_URL = 'https://guide.example.invalid/';

/* The one link that leaves for the MLH application, reached from /my's
   Preptember pitch band. /host and the nav both send would-be organizers
   to /my rather than straight out, so every application now starts on the
   signed-in hub and carries this single utm_content. The /host-specific
   constant ('host-apply') retired with that CTA's outbound link: nothing
   rendered it any more, and a tag no link carries is attribution
   fiction. */
export const MY_HOST_APPLY_URL = tagged(
  'https://organize.mlh.com/host/hacktoberfest-2026',
  { content: 'my-host-apply' },
);

/* The Host Handbook — MLH's organizer guide on GitBook, open to everyone
   whether or not they've applied. Untagged like HOST_GUIDE_URL above:
   utm params on a docs link are attribution noise. */
export const HOST_HANDBOOK_URL =
  'https://mlh.gitbook.io/mlh-hacktoberfest-organizer-guide';

/* The #hacktoberfest-2026 channel in MLH's Discord, in /my's host
   resources band. Untagged for the same reason the handbook is — utm
   params on an invite link are attribution noise — and the row is open
   rather than gated because the invite itself is: it is a public server
   anyone with the link can join, so a padlock beside it would claim a
   gate that does not exist. */
export const HOST_DISCORD_URL = 'https://discord.com/invite/mlh';

/* The Hacktoberfest team's inbox, the third open row in /my's host
   resources band. A mailto rather than a form: the row is the private
   channel beside the public one, and anything that needs a human to read
   it should land where humans already read. The address appears in the
   row's copy too (content.mjs is words only, and an address nobody can
   see is one nobody can save); preptember.test.mjs pins the two
   together so they cannot drift apart. */
export const HOST_EMAIL_URL = 'mailto:hacktoberfest@mlh.io';

/* The approved-host brand kit in /my's host resources band. No published
   home yet — a reserved-TLD placeholder on the activity-links convention:
   it can never resolve, and the guard in preptember.test.mjs fails the
   moment a real URL arrives, forcing a deliberate swap. */
export const HOST_BRAND_KIT_URL = 'https://brand-kit.example.invalid/';
