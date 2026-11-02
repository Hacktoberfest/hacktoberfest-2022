import { absoluteUrl, meta } from './meta';

/* JSON-LD for the homepage, as one @graph so the nodes can reference each
   other by @id instead of repeating themselves.

   Everything here restates something the page already says out loud. The one
   inference is the event's date range: the page commits to "October 2026"
   without naming days, so the month is used whole. Narrow it once the real
   dates are set — an end date in the past makes the event look over.

   Partner URLs are the plain canonical ones, not the UTM-tagged links from
   data/links.js: these identify the organizations to search engines rather
   than sending traffic. */

const ID = {
  website: absoluteUrl('/#website'),
  event: absoluteUrl('/#event'),
  mlh: 'https://mlh.com/#organization',
  dev: 'https://dev.to/#organization',
  digitalocean: 'https://www.digitalocean.com/#organization',
};

const mlh = {
  '@type': 'Organization',
  '@id': ID.mlh,
  name: 'Major League Hacking',
  alternateName: 'MLH',
  url: 'https://mlh.com',
};

const dev = {
  '@type': 'Organization',
  '@id': ID.dev,
  name: 'DEV',
  url: 'https://dev.to',
};

const digitalocean = {
  '@type': 'Organization',
  '@id': ID.digitalocean,
  name: 'DigitalOcean',
  url: 'https://www.digitalocean.com',
};

const website = {
  '@type': 'WebSite',
  '@id': ID.website,
  name: meta.siteName,
  url: absoluteUrl('/'),
  description: meta.description,
  inLanguage: 'en',
  publisher: { '@id': ID.mlh },
};

const event = {
  '@type': 'Event',
  '@id': ID.event,
  name: 'Hacktoberfest 2026',
  description: meta.description,
  url: absoluteUrl('/'),
  image: meta.image,
  startDate: '2026-10-01',
  endDate: '2026-10-31',
  eventStatus: 'https://schema.org/EventScheduled',
  /* 500+ community-hosted Fests plus a global online event. Only the
     online half has one location to name. */
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  location: {
    '@type': 'VirtualLocation',
    url: absoluteUrl('/'),
  },
  organizer: [{ '@id': ID.mlh }, { '@id': ID.dev }],
  sponsor: { '@id': ID.digitalocean },
  about: 'Building with open source AI',
};

/* No FAQPage node: the FAQ left the homepage after October, and schema
   naming questions the page does not carry would describe content it
   does not have. */

const homepageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [website, event, mlh, dev, digitalocean],
};

/* Serialized here rather than at the call site so the "<" escape can't be
   forgotten: a literal </script> anywhere in the copy would otherwise close
   the tag early and spill JSON into the page. */
export const homepageJsonLdScript = JSON.stringify(homepageJsonLd).replace(
  /</g,
  '\\u003c',
);
