import { tagged } from './links.js';

/* The public sponsor wall is deliberately curated, mirroring the sponsor
   portal's config/sponsor_wall.yml: complete brand logos, confirmed partners
   only. Ghost is confirmed there too, but its
   only available asset is an og-image social card rather than a logo, so
   it stays off the wall until a real logo lands.

   Each entry carries one tagged URL per placement, the same per-placement
   attribution every other outbound link on the site uses: `url` is the
   /sponsor wall ('sponsor-logo-<slug>'), `homeUrl` the homepage wall
   ('home-sponsor-logo-<slug>'). A `wide` entry is a wordmark so long
   that the standard logo width would leave it a sliver; both walls give
   it a wider seat so it reads at the same weight as its neighbours. */
const roster = [
  { name: 'Tiger Data', slug: 'tiger-data', site: 'https://www.tigerdata.com' },
  { name: 'Snowflake', slug: 'snowflake', site: 'https://www.snowflake.com' },
  { name: 'MongoDB', slug: 'mongodb', site: 'https://www.mongodb.com' },
  { name: 'Gauge', slug: 'gauge', site: 'https://www.withgauge.com' },
  { name: 'Solana', slug: 'solana', site: 'https://solana.com' },
  { name: 'Render', slug: 'render', site: 'https://render.com' },
  { name: 'GitHub', slug: 'github', site: 'https://github.com' },
  { name: 'Sentry', slug: 'sentry', site: 'https://sentry.io' },
  {
    name: 'Backboard.io',
    slug: 'backboard',
    site: 'https://backboard.io',
    wide: true,
  },
  { name: 'IBM', slug: 'ibm', site: 'https://www.ibm.com' },
  {
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    site: 'https://elevenlabs.io',
    wide: true,
  },
  {
    name: 'Paper Compute',
    slug: 'paper-compute',
    site: 'https://papercompute.com',
    wide: true,
  },
  { name: 'Entire', slug: 'entire', site: 'https://entire.io' },
  {
    name: 'Prior Labs',
    slug: 'prior-labs',
    site: 'https://priorlabs.ai',
    wide: true,
  },
  {
    name: 'Google Cloud',
    slug: 'google-cloud',
    site: 'https://cloud.google.com',
    wide: true,
  },
  { name: 'Gemma', slug: 'gemma', site: 'https://ai.google.dev/gemma' },
  { name: 'Qualcomm', slug: 'qualcomm', site: 'https://www.qualcomm.com' },
  { name: 'Arduino', slug: 'arduino', site: 'https://www.arduino.cc' },
];

const logoScales = { gemma: 2.7, arduino: 1.25 };
const logoExtensions = { gemma: 'png' };

export const sponsors = roster.map(({ name, slug, site, wide = false }) => ({
  name,
  slug,
  wide,
  url: tagged(site, { content: `sponsor-logo-${slug}` }),
  homeUrl: tagged(site, { content: `home-sponsor-logo-${slug}` }),
  logo: `/sponsors/${slug}.${logoExtensions[slug] ?? 'svg'}`,
  scale: logoScales[slug] ?? 1,
}));
