import { tagged } from './links.js';

/* The public sponsor wall is deliberately curated, mirroring the sponsor
   portal's config/sponsor_wall.yml: complete logos supplied by the
   sponsor, confirmed partners only. Ghost is confirmed there too, but its
   only available asset is an og-image social card rather than a logo, so
   it stays off the wall until a real logo lands.

   Each entry carries one tagged URL per placement, the same per-placement
   attribution every other outbound link on the site uses: `url` is the
   /sponsor wall ('sponsor-logo-<slug>'), `homeUrl` the homepage wall
   ('home-sponsor-logo-<slug>'). */
const roster = [
  { name: 'Tiger Data', slug: 'tiger-data', site: 'https://www.tigerdata.com' },
  { name: 'Snowflake', slug: 'snowflake', site: 'https://www.snowflake.com' },
  { name: 'MongoDB', slug: 'mongodb', site: 'https://www.mongodb.com' },
  { name: 'Gauge', slug: 'gauge', site: 'https://www.withgauge.com' },
  { name: 'Solana', slug: 'solana', site: 'https://solana.com' },
  { name: 'Render', slug: 'render', site: 'https://render.com' },
  { name: 'GitHub', slug: 'github', site: 'https://github.com' },
  { name: 'Sentry', slug: 'sentry', site: 'https://sentry.io' },
  { name: 'Backboard.io', slug: 'backboard', site: 'https://backboard.io' },
];

export const sponsors = roster.map(({ name, slug, site }) => ({
  name,
  slug,
  url: tagged(site, { content: `sponsor-logo-${slug}` }),
  homeUrl: tagged(site, { content: `home-sponsor-logo-${slug}` }),
  logo: `/sponsors/${slug}.svg`,
}));
