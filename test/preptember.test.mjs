import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import {
  HOST_BRAND_KIT_URL,
  HOST_DISCORD_URL,
  HOST_EMAIL_URL,
  HOST_HANDBOOK_URL,
  MY_HOST_APPLY_URL,
} from '../src/data/links.js';
import { isOrganizing, organizingFests } from '../src/lib/fests.mjs';

const fest = (overrides) => ({
  id: 'fest-1',
  role: 'attending',
  status: 'registered',
  date: '2026-10-17',
  applicationStatus: null,
  ...overrides,
});

/* The Your Applications filter: organizing entries only — applications in
   flight and real organized events both count, because both are the
   signed-in user's own — in the same date order the fests grid uses. */
test('organizingFests keeps only organizing entries, in date order', () => {
  const sorted = organizingFests([
    fest({ id: 'later', role: 'organizing', date: '2026-10-20' }),
    fest({ id: 'attending' }),
    fest({
      id: 'application',
      role: 'organizing',
      date: '2026-08-01',
      applicationStatus: 'draft',
    }),
  ]);

  assert.deepEqual(
    sorted.map((entry) => entry.id),
    ['application', 'later'],
  );
});

test('organizingFests degrades to empty on junk', () => {
  assert.deepEqual(organizingFests(undefined), []);
  assert.deepEqual(organizingFests([]), []);
  assert.deepEqual(organizingFests([null, 'junk', fest()]), []);
});

/* October's gate on the resources band. This helper was deleted once
   before while a `PREPTEMBER && …` short-circuit hid every call site —
   webpack turns a missing named export into undefined at call time, so
   the page built green and crashed the moment the flag flipped. A unit
   test is what makes the export's existence a tested fact rather than a
   bundler accident. */
test('isOrganizing is true for any organizing entry, false otherwise', () => {
  assert.equal(
    isOrganizing([fest({ role: 'organizing', status: null })]),
    true,
  );
  assert.equal(
    isOrganizing([
      fest({ role: 'organizing', status: null, applicationStatus: 'draft' }),
    ]),
    true,
  );
  assert.equal(isOrganizing([fest()]), false);
  assert.equal(isOrganizing([]), false);
  assert.equal(isOrganizing(undefined), false);
  assert.equal(isOrganizing([null, 'junk']), false);
});

/* The application CTA ladder. Approved is "Publish event", not "View
   application": the API swaps the card's manageUrl to the Organizer HQ
   event page at that rung, and publishing there is the approved host's
   one next act. The two pre-approval rungs still point at the
   application form. */
test('the application CTAs match what the manage link does at each rung', () => {
  assert.equal(my.fests.applicationCtas.draft, 'Finish your application');
  assert.equal(my.fests.applicationCtas.submitted, 'View application');
  assert.equal(my.fests.applicationCtas.approved, 'Publish event');
});

/* One greeting on both sides of the Preptember flag: "your
   Hacktoberfest", never a month name. The preptemberAccent swap retired
   2026-08-18 — its reappearance would mean the hero names the wrong
   thing again for one side of the flag. */
test('the welcome accent says Hacktoberfest and never swaps', () => {
  assert.match(my.welcome.accent, /Hacktoberfest/);
  assert.equal(my.welcome.preptemberAccent, undefined);
});

/* The band borrows the fests band's application badges and CTA copy
   (my.fests) for its cards, with one word of its own: a published event
   wears "Event Published" here, not "Hosting"/"Hosted" — during
   Preptember the list is about where applications stand, and a public
   event is the rung past an approval MLH has not published yet. Plus the frame — heading, lede, and the ghost that
   carries Preptember's apply CTA. The ghost always renders, in one of
   two voices: "start your first" when the list is empty, "host another"
   once any application or event is on it. Both variants need all three
   pieces, since either can be the page's one apply CTA. */
test('the applications copy carries a heading, lede, badge, and both ghost voices', () => {
  assert.ok(my.applications.heading.lead);
  assert.ok(my.applications.heading.accent);
  assert.ok(my.applications.lede);
  assert.ok(my.applications.publishedBadge);

  [my.applications.ghost, my.applications.ghostMore].forEach((ghost) => {
    assert.ok(ghost.title);
    assert.ok(ghost.body);
    assert.ok(ghost.cta);
  });
});

/* The host resources band: the handbook is open to everyone, anything
   else waits for MLH's approval. The lock lives in the copy as a
   per-item flag so the component can't disagree with the words — and
   the handbook must never carry it, or the band's one always-available
   resource goes dark for every unapproved visitor. The brand kit row is
   hidden for now (no real destination yet — see content.mjs), so the
   gated list may legitimately be empty. */
test('the host resources copy locks every row but the open two', () => {
  assert.ok(my.hostResources.heading.lead);
  assert.ok(my.hostResources.heading.accent);
  assert.ok(my.hostResources.lede);
  assert.ok(my.hostResources.lockedBadge);

  /* The rows anyone can use before they apply, in order. Named rather
     than counted: the point of this test is that opening another row is
     a decision someone has to make here, not a line that slips into the
     copy. The Discord row belongs to this list and is hidden for now —
     see the note in content.mjs. */
  const OPEN = ['handbook', 'email'];
  const open = my.hostResources.items.slice(0, OPEN.length);
  assert.deepEqual(
    open.map((item) => item.id),
    OPEN,
  );
  open.forEach((item) => {
    assert.ok(!item.locked, `${item.id} must not be locked`);
  });

  my.hostResources.items.slice(OPEN.length).forEach((item) => {
    assert.equal(item.locked, true, `${item.id} should be locked`);
  });

  my.hostResources.items.forEach((item) => {
    assert.ok(item.title, `${item.id} has no title`);
    assert.ok(item.copy, `${item.id} has no copy`);
    assert.ok(item.cta, `${item.id} has no cta`);
  });
});

/* The handbook, the Discord invite, and the team's inbox are real, open
   resources — pinned exactly so they cannot silently drift. The brand kit
   has no real destination yet, so it sits on the reserved TLD like the
   activity links do: it can never resolve, and this fails the moment a
   real URL arrives, forcing a deliberate swap. */
test('the open resource URLs are real and the brand kit is a placeholder', () => {
  assert.equal(
    HOST_HANDBOOK_URL,
    'https://mlh.gitbook.io/mlh-hacktoberfest-organizer-guide',
  );

  /* Still pinned while its row is hidden: the constant and its wiring
     stay in place so restoring the row is a content edit. */
  assert.equal(HOST_DISCORD_URL, 'https://discord.com/invite/mlh');
  assert.equal(HOST_EMAIL_URL, 'mailto:hacktoberfest@mlh.io');

  /* The address is in the row's copy as well as in the mailto — see the
     note on the constant — and an address that reads one way and links
     another is worse than either alone. */
  const email = my.hostResources.items.find((item) => item.id === 'email');
  assert.ok(
    email.copy.includes(HOST_EMAIL_URL.replace('mailto:', '')),
    'the email row must show the address it links to',
  );

  assert.match(
    HOST_BRAND_KIT_URL,
    /example\.invalid/,
    `${HOST_BRAND_KIT_URL} looks like a real URL — update this test when it is`,
  );
});

/* The why-host callout that closes the Preptember page, adapted from the
   fests directory's "That's your cue." band. The pitch is a numbered
   list of perks rather than a paragraph; the numbers themselves are
   presentation (the component derives 01–05 from the index), so the copy
   is just the five rows. The photo needs its alt for the same reason the
   original carries one. */
test('the why-host copy carries a title, five perks, CTA, and photo alt', () => {
  assert.ok(my.whyHost.title);
  assert.ok(my.whyHost.cta);
  assert.ok(my.whyHost.photoAlt);

  assert.equal(my.whyHost.perks.length, 5);
  my.whyHost.perks.forEach((perk) => assert.ok(perk));
});

/* The single outbound route to the MLH application. /host and the nav
   both hand off to /my rather than linking out themselves, so this is the
   only link that carries an apply tag — pinned here so the destination
   and the tag can't drift apart unnoticed. */
test('the /my apply link points at the MLH application and carries its tag', () => {
  const mine = new URL(MY_HOST_APPLY_URL);

  assert.equal(mine.origin, 'https://organize.mlh.com');
  assert.equal(mine.pathname, '/host/hacktoberfest-2026');
  assert.equal(mine.searchParams.get('utm_content'), 'my-host-apply');
});
