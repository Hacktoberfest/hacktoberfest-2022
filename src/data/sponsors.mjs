import { tagged } from './links.js';

/* The public sponsor wall is deliberately curated, mirroring the sponsor
   portal's config/sponsor_wall.yml: complete logos supplied by the
   sponsor, confirmed partners only. Ghost is confirmed there too, but its
   only available asset is an og-image social card rather than a logo, so
   it stays off the wall until a real logo lands.

   Each url carries its own utm_content ('sponsor-logo-<slug>'), the same
   per-placement attribution every other outbound link on the site uses. */
export const sponsors = [
  {
    name: 'Tiger Data',
    slug: 'tiger-data',
    url: tagged('https://www.tigerdata.com', {
      content: 'sponsor-logo-tiger-data',
    }),
    logo: '/sponsors/tiger-data.svg',
  },
  {
    name: 'Snowflake',
    slug: 'snowflake',
    url: tagged('https://www.snowflake.com', {
      content: 'sponsor-logo-snowflake',
    }),
    logo: '/sponsors/snowflake.svg',
  },
  {
    name: 'MongoDB',
    slug: 'mongodb',
    url: tagged('https://www.mongodb.com', { content: 'sponsor-logo-mongodb' }),
    logo: '/sponsors/mongodb.svg',
  },
  {
    name: 'Gauge',
    slug: 'gauge',
    url: tagged('https://www.withgauge.com', { content: 'sponsor-logo-gauge' }),
    logo: '/sponsors/gauge.svg',
  },
  {
    name: 'Solana',
    slug: 'solana',
    url: tagged('https://solana.com', { content: 'sponsor-logo-solana' }),
    logo: '/sponsors/solana.svg',
  },
  {
    name: 'Render',
    slug: 'render',
    url: tagged('https://render.com', { content: 'sponsor-logo-render' }),
    logo: '/sponsors/render.svg',
  },
  {
    name: 'GitHub',
    slug: 'github',
    url: tagged('https://github.com', { content: 'sponsor-logo-github' }),
    logo: '/sponsors/github.svg',
  },
  {
    name: 'Sentry',
    slug: 'sentry',
    url: tagged('https://sentry.io', { content: 'sponsor-logo-sentry' }),
    logo: '/sponsors/sentry.svg',
  },
  {
    name: 'Backboard.io',
    slug: 'backboard',
    url: tagged('https://backboard.io', {
      content: 'sponsor-logo-backboard',
    }),
    logo: '/sponsors/backboard.svg',
  },
];
