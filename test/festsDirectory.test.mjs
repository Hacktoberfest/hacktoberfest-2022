import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

/* session.mjs reads the base URL once at import time, so it is set above
   before this file's first import — the progress-api-client.test.mjs
   pattern. Fixture mode (variable unset) lives in
   festsDirectory-mock.test.mjs, its own process under node:test. */
const { festFromEvent, getFestsDirectory } = await import(
  '../src/lib/festsDirectory.mjs'
);

/* An event as /api/events actually returns one. */
const EVENT = {
  id: 'evt-1',
  name: 'Hacktober Fest Brooklyn',
  slug: 'hacktober-fest-brooklyn',
  format: 'hackathon',
  status: 'published',
  startsAt: '2026-10-03T14:00:00.000Z',
  endsAt: '2026-10-03T22:00:00.000Z',
  timeZone: 'America/New_York',
  websiteUrl: null,
  registrationUrl: 'https://example.invalid/register/brooklyn',
  logoUrl: null,
  backgroundUrl: null,
  seriesId: 'series-1',
  seasonIdentifier: 'hacktoberfest-2026',
  address: {
    line1: '123 Fulton St',
    line2: null,
    line3: null,
    city: 'Brooklyn',
    state: 'NY',
    postalCode: '11201',
    country: 'United States',
    latitude: 40.6782,
    longitude: -73.9442,
  },
};

const withFetch = (t, impl) => {
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    calls.push(url);
    return impl(url);
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  return calls;
};

const jsonResponse = (body) => ({ ok: true, json: async () => body });

test('fetches /api/events from the configured base URL', async (t) => {
  const calls = withFetch(t, () => jsonResponse({ events: [], count: 0 }));

  const result = await getFestsDirectory();
  assert.deepEqual(calls, ['https://api.test.invalid/api/events']);
  assert.deepEqual(result, []);
});

test('normalizes API events into the card shape', async (t) => {
  withFetch(t, () => jsonResponse({ events: [EVENT], count: 1 }));

  const result = await getFestsDirectory();
  assert.deepEqual(result, [
    {
      id: 'evt-1',
      name: 'Hacktober Fest Brooklyn',
      hostedBy: null,
      format: null,
      city: 'Brooklyn',
      state: 'New York',
      country: 'United States',
      venue: null,
      addressLine1: '123 Fulton St',
      addressLine2: null,
      addressLine3: null,
      postalCode: '11201',
      lat: 40.6782,
      lng: -73.9442,
      date: '2026-10-03',
      /* 14:00–22:00 UTC is 10 AM – 6 PM in New York (EDT). */
      time: '10:00 AM – 6:00 PM',
      registrationUrl: 'https://example.invalid/register/brooklyn',
      websiteUrl: null,
      logoUrl: null,
    },
  ]);
});

test('drops non-object entries and tolerates a missing address', async (t) => {
  withFetch(t, () =>
    jsonResponse({
      events: [
        null,
        'not-an-event',
        { ...EVENT, id: 'evt-online', address: null, registrationUrl: null },
      ],
      count: 3,
    }),
  );

  const result = await getFestsDirectory();
  assert.deepEqual(result, [
    {
      id: 'evt-online',
      name: 'Hacktober Fest Brooklyn',
      hostedBy: null,
      format: null,
      city: null,
      state: null,
      country: null,
      venue: null,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postalCode: null,
      lat: null,
      lng: null,
      date: '2026-10-03',
      time: '10:00 AM – 6:00 PM',
      registrationUrl: null,
      websiteUrl: null,
      logoUrl: null,
    },
  ]);
});

test('returns an empty list when the payload has no events array', async (t) => {
  withFetch(t, () => jsonResponse({ count: 0 }));
  assert.deepEqual(await getFestsDirectory(), []);

  withFetch(t, () => jsonResponse(null));
  assert.deepEqual(await getFestsDirectory(), []);
});

test('throws when the API responds with a non-OK status', async (t) => {
  withFetch(t, () => ({ ok: false, status: 503 }));
  await assert.rejects(() => getFestsDirectory());
});

test('festFromEvent falls back to the slug when the id is null', () => {
  const fest = festFromEvent({ ...EVENT, id: null });
  assert.equal(fest.id, 'hacktober-fest-brooklyn');
});

test('festFromEvent dates the Fest in its own time zone', () => {
  /* 23:30 UTC is still Oct 3 in New York but already Oct 4 in Auckland —
     the venue's calendar wins, never UTC or the viewer's zone. */
  const lateUtc = { ...EVENT, startsAt: '2026-10-03T23:30:00.000Z' };

  assert.equal(
    festFromEvent({ ...lateUtc, timeZone: 'America/New_York' }).date,
    '2026-10-03',
  );
  assert.equal(
    festFromEvent({ ...lateUtc, timeZone: 'Pacific/Auckland' }).date,
    '2026-10-04',
  );
});

test('festFromEvent falls back to UTC for missing or invalid time zones', () => {
  const lateUtc = { ...EVENT, startsAt: '2026-10-03T23:30:00.000Z' };

  assert.equal(
    festFromEvent({ ...lateUtc, timeZone: null }).date,
    '2026-10-03',
  );
  assert.equal(
    festFromEvent({ ...lateUtc, timeZone: 'Not/AZone' }).date,
    '2026-10-03',
  );
});

test('festFromEvent returns a null date for missing or unparseable startsAt', () => {
  assert.equal(festFromEvent({ ...EVENT, startsAt: null }).date, null);
  assert.equal(festFromEvent({ ...EVENT, startsAt: 'soon' }).date, null);
});

test('festFromEvent times the Fest in its own time zone', () => {
  /* 23:30 UTC is 7:30 PM in New York but 12:30 PM the next day in
     Auckland — same venue-zone rule as the date. */
  const lateUtc = {
    ...EVENT,
    startsAt: '2026-10-03T23:30:00.000Z',
    endsAt: null,
  };

  assert.equal(
    festFromEvent({ ...lateUtc, timeZone: 'America/New_York' }).time,
    '7:30 PM',
  );
  assert.equal(
    festFromEvent({ ...lateUtc, timeZone: 'Pacific/Auckland' }).time,
    '12:30 PM',
  );
});

test('festFromEvent drops the end time when endsAt is missing or unparseable', () => {
  assert.equal(festFromEvent({ ...EVENT, endsAt: null }).time, '10:00 AM');
  assert.equal(festFromEvent({ ...EVENT, endsAt: 'later' }).time, '10:00 AM');
});

test('festFromEvent falls back to UTC times for invalid time zones', () => {
  assert.equal(
    festFromEvent({ ...EVENT, timeZone: 'Not/AZone' }).time,
    '2:00 PM – 10:00 PM',
  );
});

test('festFromEvent returns a null time for missing or unparseable startsAt', () => {
  assert.equal(festFromEvent({ ...EVENT, startsAt: null }).time, null);
  assert.equal(festFromEvent({ ...EVENT, startsAt: 'soon' }).time, null);
});

test('festFromEvent nulls non-numeric coordinates', () => {
  const fest = festFromEvent({
    ...EVENT,
    address: { ...EVENT.address, latitude: '40.6782', longitude: null },
  });
  assert.equal(fest.lat, null);
  assert.equal(fest.lng, null);
});

/* The live payload's shape, not a hypothetical one: the API sends an ISO
   country code, a venue name in line1, and a format field that says
   "hackathon" for every Hacktoberfest event there is. */
test('carries the detail fields the modal renders', async (t) => {
  withFetch(t, () =>
    jsonResponse({
      events: [
        {
          ...EVENT,
          name: 'Hacktoberfest New York Hack Day',
          format: 'hackathon',
          websiteUrl: 'https://events.mlh.io/events/14678-x',
          logoUrl: 'https://mlhusercontent.com/logos/x.png',
          address: {
            line1: 'Flatiron Building',
            line2: 'Floor 3',
            line3: null,
            city: 'New York',
            state: 'New York',
            postalCode: '00109',
            country: 'US',
            latitude: null,
            longitude: null,
          },
        },
      ],
      count: 1,
    }),
  );

  const [fest] = await getFestsDirectory();

  /* Derived from the name. The API's own "hackathon" is ignored. */
  assert.equal(fest.format, 'hackDay');
  assert.equal(fest.addressLine1, 'Flatiron Building');
  assert.equal(fest.addressLine2, 'Floor 3');
  assert.equal(fest.addressLine3, null);
  assert.equal(fest.postalCode, '00109');
  assert.equal(fest.websiteUrl, 'https://events.mlh.io/events/14678-x');
  assert.equal(fest.logoUrl, 'https://mlhusercontent.com/logos/x.png');
});

/* "New York, New York, US" is what the card renders without this. */
test('expands an ISO country code to a readable name', async (t) => {
  withFetch(t, () =>
    jsonResponse({
      events: [
        { ...EVENT, id: 'us', address: { city: 'New York', country: 'US' } },
        { ...EVENT, id: 'ca', address: { city: 'Toronto', country: 'CA' } },
        { ...EVENT, id: 'gb', address: { city: 'London', country: 'GB' } },
      ],
      count: 3,
    }),
  );

  assert.deepEqual(
    (await getFestsDirectory()).map((fest) => fest.country),
    ['United States', 'Canada', 'United Kingdom'],
  );
});

/* Anything that is not a two-letter code passes through untouched, which
   is exactly what shipped before this expansion existed. A widening that
   cannot make the country worse than it already was. */
test('a country that is not an ISO code is left alone', async (t) => {
  withFetch(t, () =>
    jsonResponse({
      events: [
        { ...EVENT, id: 'a', address: { country: 'United States' } },
        { ...EVENT, id: 'b', address: { country: 'Kosovo' } },
        { ...EVENT, id: 'c', address: { country: 'QQ' } },
        { ...EVENT, id: 'd', address: { country: '' } },
      ],
      count: 4,
    }),
  );

  assert.deepEqual(
    (await getFestsDirectory()).map((fest) => fest.country),
    ['United States', 'Kosovo', 'QQ', null],
  );
});

/* MLH welds the hosting partner onto the event name, so the card would
   carry both in one heading if the seam did not take them apart. */
test('splits the hosting partner out of the event name', async (t) => {
  withFetch(t, () =>
    jsonResponse({
      events: [
        { ...EVENT, name: 'Hacktoberfest Meet Up Toronto x Hack the 6ix' },
      ],
      count: 1,
    }),
  );

  const [fest] = await getFestsDirectory();

  assert.equal(fest.name, 'Hacktoberfest Meet Up Toronto');
  assert.equal(fest.hostedBy, 'Hack the 6ix');
  assert.equal(fest.format, 'meetUp');
});

/* The format is read from the title, not the whole name, so a partner
   cannot claim a format the Fest never had. Belt and braces over the
   anchored match in festFormat.mjs: this holds even for a name that opens
   off-convention, where the anchor does not apply. */
test('a partner cannot lend the Fest its own format', async (t) => {
  withFetch(t, () =>
    jsonResponse({
      events: [{ ...EVENT, name: 'Toronto Meet Up x Hack Day Collective' }],
      count: 1,
    }),
  );

  const [fest] = await getFestsDirectory();

  assert.equal(fest.name, 'Toronto Meet Up');
  assert.equal(fest.hostedBy, 'Hack Day Collective');
  assert.equal(fest.format, 'meetUp');
});

/* Both shapes of address line one are in the live data, so both are pinned
   here. A venue is lifted out; a street is left in the address run. */
test('lifts a venue name out of the address but not a street', async (t) => {
  withFetch(t, () =>
    jsonResponse({
      events: [
        { ...EVENT, id: 'venue', address: { line1: 'Flatiron Building' } },
        { ...EVENT, id: 'street', address: { line1: '130 St George St' } },
      ],
      count: 2,
    }),
  );

  const [venue, street] = await getFestsDirectory();

  assert.equal(venue.venue, 'Flatiron Building');
  assert.equal(venue.addressLine1, 'Flatiron Building');
  assert.equal(street.venue, null);
  assert.equal(street.addressLine1, '130 St George St');
});

/* MLH sends "ON" for one Toronto Fest and "Ontario" for another. */
test('spells out abbreviated states, and leaves the rest alone', async (t) => {
  withFetch(t, () =>
    jsonResponse({
      events: [
        { ...EVENT, id: 'a', address: { city: 'Toronto', state: 'ON' } },
        { ...EVENT, id: 'b', address: { city: 'Toronto', state: 'Ontario' } },
        {
          ...EVENT,
          id: 'c',
          address: { city: 'Bengaluru', state: 'Karnataka' },
        },
      ],
      count: 3,
    }),
  );

  assert.deepEqual(
    (await getFestsDirectory()).map((fest) => fest.state),
    ['Ontario', 'Ontario', 'Karnataka'],
  );
});
