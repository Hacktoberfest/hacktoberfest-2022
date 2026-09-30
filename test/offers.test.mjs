import assert from 'node:assert/strict';
import test from 'node:test';

import { OFFERS } from '../src/data/fixtures.mjs';
import {
  claimLinkFrom,
  mockOffers,
  normalizeOffers,
  offersPageState,
  offersWithCodes,
} from '../src/lib/offers.mjs';

/* The seam's refusals. The API already de-duplicates and filters; these
   tests pin only what the page must never render: a card it cannot name, a
   link that is not https, a response that is not a list. */

const card = (overrides = {}) => ({
  company: { id: 'c1', name: 'Acme', logoUrl: 'https://example.com/a.png' },
  challenges: [
    {
      id: 'ch1',
      name: 'Best Use of Acme',
      shortDescription: 'Build with Acme.',
      prizeDescription: 'Hoodies.',
      url: 'https://dev.to/challenges/x',
      external: true,
    },
  ],
  promo: {
    poolId: 'p1',
    eventId: 'e1',
    label: 'Acme credit',
    description: '$10 credit.',
    restrictions: 'One per person.',
    requirements: [
      { kind: 'verified_phone', met: true },
      { kind: 'github_oauth', met: false },
    ],
  },
  ...overrides,
});

test('a well-formed card passes through unchanged', () => {
  assert.deepEqual(normalizeOffers([card()]), [card()]);
});

test('a response that is not a list is unreadable', () => {
  assert.equal(normalizeOffers(null), null);
  assert.equal(normalizeOffers({ offers: [] }), null);
  assert.equal(normalizeOffers('[]'), null);
});

test('an empty list is an empty list, not an error', () => {
  assert.deepEqual(normalizeOffers([]), []);
});

test('a card with no nameable company is dropped', () => {
  assert.deepEqual(
    normalizeOffers([
      card({ company: null }),
      card({ company: { id: 'c1', name: '  ' } }),
      card({ company: { name: 'Acme' } }),
      null,
      'Acme',
    ]),
    [],
  );
});

test('a card with neither a challenge nor a promo is dropped', () => {
  assert.deepEqual(
    normalizeOffers([card({ challenges: [], promo: null })]),
    [],
  );
  assert.deepEqual(
    normalizeOffers([
      card({ challenges: [{ name: 'x' }], promo: { label: 'y' } }),
    ]),
    [],
  );
});

test('only https URLs survive, for logos and challenges alike', () => {
  const [offer] = normalizeOffers([
    card({
      company: { id: 'c1', name: 'Acme', logoUrl: 'javascript:alert(1)' },
      challenges: [
        { id: 'a', name: 'A', url: 'javascript:alert(1)', external: true },
        { id: 'b', name: 'B', url: 'http://dev.to/x', external: true },
        { id: 'c', name: 'C', url: '/relative', external: false },
      ],
    }),
  ]);

  assert.equal(offer.company.logoUrl, null);
  assert.deepEqual(
    offer.challenges.map((challenge) => challenge.url),
    [null, null, null],
  );
});

test('a challenge keeps its name when its URL is dropped', () => {
  const [offer] = normalizeOffers([
    card({
      challenges: [{ id: 'a', name: 'A', url: 'nope', external: 'yes' }],
    }),
  ]);

  assert.deepEqual(offer.challenges, [
    {
      id: 'a',
      name: 'A',
      shortDescription: null,
      prizeDescription: null,
      url: null,
      external: false,
    },
  ]);
});

test('a promo without a pool or an event is no promo', () => {
  for (const promo of [
    { eventId: 'e1', label: 'L' },
    { poolId: 'p1', label: 'L' },
    'p1',
  ]) {
    const [offer] = normalizeOffers([card({ promo })]);
    assert.equal(offer.promo, null, JSON.stringify(promo));
  }
});

test('a promo MLH gave no label is still a promo', () => {
  // The API sends label: null for a pool MLH has not labelled.
  const [offer] = normalizeOffers([
    card({ promo: { poolId: 'p1', eventId: 'e1', label: null } }),
  ]);
  assert.deepEqual(offer.promo, {
    poolId: 'p1',
    eventId: 'e1',
    label: null,
    description: null,
    restrictions: null,
    requirements: [],
  });
});

test('a promo from an API that predates requirements has none', () => {
  const [offer] = normalizeOffers([
    card({ promo: { poolId: 'p1', eventId: 'e1', requirements: 'phone' } }),
  ]);
  assert.deepEqual(offer.promo.requirements, []);
});

/* A requirement the page has no words for is one it cannot state, and a
   `met` that is not a boolean is the API saying it could not check. */
test('requirements keep known kinds, in order, with met as true, false or null', () => {
  const [offer] = normalizeOffers([
    card({
      promo: {
        poolId: 'p1',
        eventId: 'e1',
        requirements: [
          { kind: 'github_oauth', met: null },
          { kind: 'discord', met: true },
          null,
          'verified_phone',
          { kind: 'verified_phone', met: 'true' },
          { kind: 'verified_phone', met: false },
          { kind: 'github_oauth' },
        ],
      },
    }),
  ]);

  assert.deepEqual(offer.promo.requirements, [
    { kind: 'github_oauth', met: null },
    { kind: 'verified_phone', met: null },
    { kind: 'verified_phone', met: false },
    { kind: 'github_oauth', met: null },
  ]);
});

test('a claim link must be https', () => {
  assert.equal(
    claimLinkFrom({ claimLink: 'https://www.mlh.com/events/x/redeem?token=t' }),
    'https://www.mlh.com/events/x/redeem?token=t',
  );

  for (const body of [
    { claimLink: 'javascript:alert(1)' },
    { claimLink: 'http://www.mlh.com/x' },
    { claimLink: '/events/x' },
    { claimLink: '' },
    {},
    null,
  ]) {
    assert.throws(() => claimLinkFrom(body), JSON.stringify(body));
  }
});

test('the mocked build serves every fixture card, read through the seam', async () => {
  const offers = await mockOffers(undefined);

  assert.equal(offers.length, OFFERS.length);
  assert.deepEqual(offers, normalizeOffers(OFFERS));
  assert.ok(offers.some((offer) => offer.promo === null));
  assert.ok(offers.some((offer) => offer.challenges.some((c) => c.external)));
  assert.ok(offers.some((offer) => offer.challenges.some((c) => !c.external)));

  // Each requirement state a reviewer needs to see, and a promo with none.
  const promos = offers.map((offer) => offer.promo).filter(Boolean);
  const met = promos.flatMap((promo) => promo.requirements.map((r) => r.met));
  assert.ok(met.includes(true));
  assert.ok(met.includes(false));
  assert.ok(promos.some((promo) => promo.requirements.length === 0));
});

/* Whether a requirement is met is the attendee's, not the card's, so the
   "could not check" state is a scenario of its own: the default's cards for
   someone whose MLH account the API could not read. */
test('the eligible scenario is an attendee MLH could not check', async () => {
  const offers = await mockOffers('eligible');
  const requirements = offers.flatMap((offer) =>
    offer.promo ? offer.promo.requirements : [],
  );

  assert.deepEqual(
    offers.map((offer) => offer.company.id),
    OFFERS.map((offer) => offer.company.id),
  );
  assert.ok(requirements.length > 0);
  assert.ok(requirements.every((requirement) => requirement.met === null));
});

test('the nothing-done scenario is the empty state', async () => {
  assert.deepEqual(await mockOffers('nothing-done'), []);
});

test('the error and mlh-down review links reject as the live API would', async () => {
  await assert.rejects(
    mockOffers('error'),
    (error) => error.status === undefined,
  );
  await assert.rejects(mockOffers('mlh-down'), (error) => error.status === 502);
});

test('page states: 401 signs in again, 502 is MLH, everything else retries', () => {
  const failed = (status) => Object.assign(new Error('x'), { status });

  assert.equal(offersPageState(failed(401)), 'signedOut');
  assert.equal(offersPageState(failed(502)), 'mlhDown');
  // An API deployed before /api/me/offers.
  assert.equal(offersPageState(failed(404)), 'error');
  assert.equal(offersPageState(failed(403)), 'error');
  assert.equal(offersPageState(failed(500)), 'error');
  assert.equal(offersPageState(new TypeError('Failed to fetch')), 'error');
});

/* The page lists codes: a sponsor with only a challenge gets no row, and
   its challenge is not shown on its own. */
const cardWith = (id, promo) => ({
  company: { id, name: id, logoUrl: null },
  challenges: [],
  promo,
});

const promoFor = (id) => ({
  poolId: `pool-${id}`,
  eventId: 'evt-1',
  label: null,
  description: null,
  restrictions: null,
  requirements: [],
});

test('offersWithCodes keeps only sponsors with a code, in the API order', () => {
  const b = cardWith('b', promoFor('b'));
  const a = cardWith('a', promoFor('a'));

  assert.deepEqual(offersWithCodes([]), []);
  assert.deepEqual(offersWithCodes([b, cardWith('c', null), a]), [b, a]);
});

test('the mocked build lists its two codes, not the challenge-only sponsor', async () => {
  const codes = offersWithCodes(await mockOffers(undefined));

  assert.deepEqual(
    codes.map((offer) => offer.company.name),
    ['Acme Cloud', 'DigitalOcean'],
  );
});
