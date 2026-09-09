import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import {
  SELF_FIXABLE_CHECKS,
  blockingCheckFailures,
  eventCardState,
  festDidNotAttend,
  festEditUrl,
  festIsPast,
  festTimeRange,
  formatFestDate,
  hasApplied,
  isHost,
  sortFestsByDate,
} from '../src/lib/fests.mjs';

const TODAY = '2026-10-10';

const fest = (overrides) => ({
  id: 'fest-1',
  name: 'Hacktober Fest Tokyo',
  city: 'Tokyo',
  country: 'Japan',
  date: '2026-10-17',
  startTime: '10:00 AM',
  endTime: '6:00 PM',
  endsAt: '2026-10-17T09:00:00.000Z',
  status: 'registered',
  role: 'attending',
  registrationUrl: null,
  mlhPublished: null,
  hacktoberfestPublished: null,
  acknowledgedAt: null,
  ...overrides,
});

test('sortFestsByDate orders one flat list soonest-first, whatever the role', () => {
  const sorted = sortFestsByDate([
    fest({ id: 'c', date: '2026-10-24', role: 'organizing' }),
    fest({ id: 'a', date: '2026-08-01', status: 'checked_in' }),
    fest({ id: 'b', date: '2026-10-17' }),
  ]);

  assert.deepEqual(
    sorted.map((f) => f.id),
    ['a', 'b', 'c'],
  );
});

test('malformed dates sort last, never throw', () => {
  const sorted = sortFestsByDate([
    fest({ id: 'no-date', date: undefined }),
    fest({ id: 'junk-date', date: 'October-ish' }),
    fest({ id: 'dated', date: '2026-10-24' }),
  ]);

  assert.equal(sorted[0].id, 'dated');
  assert.deepEqual(
    sorted
      .map((f) => f.id)
      .slice(1)
      .sort(),
    ['junk-date', 'no-date'],
  );
});

test('non-array input yields an empty list; non-object entries are dropped', () => {
  [undefined, null, 'nope', 42, {}].forEach((junk) => {
    assert.deepEqual(sortFestsByDate(junk), []);
  });
  assert.deepEqual(
    sortFestsByDate([null, 'junk', fest({ id: 'ok' })]).map((f) => f.id),
    ['ok'],
  );
});

test('festIsPast: yesterday is past, today and malformed dates are not', () => {
  assert.equal(festIsPast(fest({ date: '2026-10-09' }), TODAY), true);
  assert.equal(festIsPast(fest({ date: TODAY }), TODAY), false);
  assert.equal(festIsPast(fest({ date: '2026-10-11' }), TODAY), false);
  assert.equal(festIsPast(fest({ date: 'October-ish' }), TODAY), false);
  assert.equal(festIsPast(fest({ date: undefined }), TODAY), false);
});

test('festTimeRange joins start and end, degrades to start alone', () => {
  assert.equal(festTimeRange(fest()), '10:00 AM – 6:00 PM');
  assert.equal(festTimeRange(fest({ endTime: null })), '10:00 AM');
  assert.equal(festTimeRange(fest({ endTime: '' })), '10:00 AM');
});

test('festTimeRange is null without a start — an end alone is not a range', () => {
  assert.equal(festTimeRange(fest({ startTime: null })), null);
  assert.equal(festTimeRange(fest({ startTime: null, endTime: null })), null);
  assert.equal(festTimeRange(fest({ startTime: 42 })), null);
});

test('festDidNotAttend flips exactly twelve hours after the end instant', () => {
  const end = Date.parse('2026-10-17T09:00:00.000Z');
  const twelveHours = 12 * 60 * 60 * 1000;

  assert.equal(festDidNotAttend(fest(), end + twelveHours - 1), false);
  assert.equal(festDidNotAttend(fest(), end + twelveHours), true);
});

test('festDidNotAttend never fires for checked-in or organized fests', () => {
  const longAfter = Date.parse('2027-01-01T00:00:00.000Z');

  assert.equal(
    festDidNotAttend(fest({ status: 'checked_in' }), longAfter),
    false,
  );
  assert.equal(
    festDidNotAttend(fest({ status: null, role: 'organizing' }), longAfter),
    false,
  );
});

test('festDidNotAttend degrades to false on missing or junk endsAt', () => {
  const longAfter = Date.parse('2027-01-01T00:00:00.000Z');

  assert.equal(festDidNotAttend(fest({ endsAt: null }), longAfter), false);
  assert.equal(festDidNotAttend(fest({ endsAt: undefined }), longAfter), false);
  assert.equal(
    festDidNotAttend(fest({ endsAt: 'five-ish' }), longAfter),
    false,
  );
});

test('formatFestDate renders a human date and rejects junk', () => {
  assert.equal(formatFestDate('2026-10-17'), 'October 17');
  assert.equal(formatFestDate('2026-08-01'), 'August 1');
  assert.equal(formatFestDate('October-ish'), null);
  assert.equal(formatFestDate(undefined), null);
  assert.equal(formatFestDate(''), null);
});

test('isHost: a real organized Fest makes a host, whatever its tense', () => {
  const organized = fest({
    role: 'organizing',
    status: null,
    applicationStatus: null,
    manageUrl: null,
  });

  assert.equal(isHost([organized]), true);
  assert.equal(isHost([fest(), organized]), true);
  // Approved counts too: the approval is what makes someone a host, even
  // before the event goes public.
  assert.equal(
    isHost([
      fest({
        role: 'organizing',
        status: null,
        applicationStatus: 'approved',
        manageUrl: 'https://example.invalid/applications/1',
      }),
    ]),
    true,
  );
});

test('isHost: in-progress applications and attending alone do not', () => {
  assert.equal(isHost([]), false);
  assert.equal(isHost(undefined), false);
  assert.equal(isHost([fest(), fest({ status: 'checked_in' })]), false);
  // rejected included: revisions required means the application is back
  // in the host's hands, not that MLH has made them a host.
  for (const applicationStatus of ['draft', 'submitted', 'rejected']) {
    assert.equal(
      isHost([
        fest({
          role: 'organizing',
          status: null,
          applicationStatus,
          manageUrl: 'https://example.invalid/applications/1',
        }),
      ]),
      false,
    );
  }
});

test('hasApplied: a sent application opens the thank-you gate', () => {
  assert.equal(
    hasApplied([fest({ role: 'organizing', applicationStatus: 'submitted' })]),
    true,
  );
  assert.equal(
    hasApplied([fest({ role: 'organizing', applicationStatus: 'approved' })]),
    true,
  );
  /* A live organized event arrives with no applicationStatus at all —
     that's further along than approved, not less. */
  assert.equal(
    hasApplied([fest({ role: 'organizing', applicationStatus: null })]),
    true,
  );
  /* Revisions required is still an application with MLH's reviewers —
     the host has answered the why-host pitch already. */
  assert.equal(
    hasApplied([fest({ role: 'organizing', applicationStatus: 'rejected' })]),
    true,
  );
  assert.equal(
    hasApplied([
      fest(),
      fest({ role: 'organizing', applicationStatus: 'submitted' }),
    ]),
    true,
  );
});

test('hasApplied: drafts, attending, and junk do not', () => {
  assert.equal(hasApplied([]), false);
  assert.equal(hasApplied(undefined), false);
  assert.equal(hasApplied('junk'), false);
  assert.equal(hasApplied([null, 'junk']), false);
  assert.equal(
    hasApplied([fest({ role: 'organizing', applicationStatus: 'draft' })]),
    false,
  );
  assert.equal(hasApplied([fest(), fest({ status: 'checked_in' })]), false);
});

test('eventCardState: only organizing event cards have one', () => {
  assert.equal(eventCardState(fest({ role: 'attending' })), null);
  assert.equal(
    eventCardState(
      fest({ role: 'organizing', applicationStatus: 'submitted' }),
    ),
    null,
  );
});

test('eventCardState: the four publication states', () => {
  const card = (over) =>
    fest({ role: 'organizing', applicationStatus: null, ...over });

  assert.equal(
    eventCardState(
      card({
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: null,
      }),
    ),
    'needs-acknowledgements',
  );
  assert.equal(
    eventCardState(
      card({
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: '2026-08-25T20:05:33.000Z',
      }),
    ),
    'checks-underway',
  );
  assert.equal(
    eventCardState(
      card({
        mlhPublished: true,
        hacktoberfestPublished: true,
        acknowledgedAt: '2026-08-25T20:05:33.000Z',
      }),
    ),
    'published',
  );
  assert.equal(
    eventCardState(
      card({
        mlhPublished: false,
        hacktoberfestPublished: false,
        acknowledgedAt: null,
      }),
    ),
    'approved-private',
  );
  /* A payload from before these fields existed (or a stale cache) keeps
     today's behavior: the published rung. */
  assert.equal(
    eventCardState(
      card({
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
      }),
    ),
    'published',
  );
});

/* The acknowledged-but-unlisted rung splits by WHOSE move it is. FestNet
   re-runs the publication checks on every sync, so a Fest that was live can
   fail one later - a host renaming their event in Organizer HQ is the case
   this was written for. "Final checks underway" tells that host to sit tight
   while nothing is happening, so a blocking failure gets its own rung. */
test("eventCardState: a blocking check failure is the host's move, not ours", () => {
  const card = (over) =>
    fest({
      role: 'organizing',
      applicationStatus: null,
      mlhPublished: true,
      hacktoberfestPublished: false,
      acknowledgedAt: '2026-08-25T20:05:33.000Z',
      ...over,
    });

  assert.equal(
    eventCardState(
      card({
        name: 'B54 x Hacktoberfest Hack Day Nairobi',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: false },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      }),
    ),
    'checks-failed',
  );

  /* Every check passing is the honest wait: the Fest is queued for the next
     sync and the wording it gets is true. */
  assert.equal(
    eventCardState(
      card({
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      }),
    ),
    'checks-underway',
  );
});

/* The advisory verdict nudges, it does not block: FestNet publishes a Fest
   with no description, so a card that stopped on one would invent a problem
   the host cannot see the effect of. */
test('eventCardState: an advisory miss alone stays the honest wait', () => {
  assert.equal(
    eventCardState(
      fest({
        role: 'organizing',
        applicationStatus: null,
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: '2026-08-25T20:05:33.000Z',
        publicationChecks: [
          { id: 'name', passed: true },
          { id: 'description', passed: false },
        ],
      }),
    ),
    'checks-underway',
  );
});

/* A published Fest outranks its checks. The stored column is what the
   website actually filters on, and FestNet can hold a listed Fest through a
   failure; re-deriving a verdict here would contradict it. */
test('eventCardState: a listed Fest stays published even with a failing check', () => {
  assert.equal(
    eventCardState(
      fest({
        role: 'organizing',
        applicationStatus: null,
        mlhPublished: true,
        hacktoberfestPublished: true,
        acknowledgedAt: '2026-08-25T20:05:33.000Z',
        publicationChecks: [{ id: 'name', passed: false }],
      }),
    ),
    'published',
  );
});

/* The edit link behind the checks pane's "Update event" CTA. The bare
   OHQ event page is where a host lands from the cards; the form that
   fixes a name or a running time is one segment further on. */
test('festEditUrl points an OHQ event link at its edit form', () => {
  assert.equal(
    festEditUrl({
      manageUrl: 'https://organize.mlh.com/events/14711-frenchtoastfest',
    }),
    'https://organize.mlh.com/events/14711-frenchtoastfest/edit',
  );
  /* The fixtures' own origin, so a mocked build exercises the real
     rewrite rather than the fallback. */
  assert.equal(
    festEditUrl({
      manageUrl: 'https://example.invalid/events/14693-horta-hacktober-bash',
    }),
    'https://example.invalid/events/14693-horta-hacktober-bash/edit',
  );
});

/* Anything that is not an OHQ event page is handed back as it came:
   /edit is only known to exist on that one route, and the application
   links MLH sends for the rungs below already point at their own form. */
test('festEditUrl leaves every other manage link alone', () => {
  assert.equal(
    festEditUrl({
      manageUrl: 'https://organize.mlh.com/applications/47507/edit',
    }),
    'https://organize.mlh.com/applications/47507/edit',
  );
  assert.equal(
    festEditUrl({
      manageUrl: 'https://organize.mlh.com/events/14711-frenchtoastfest/edit',
    }),
    'https://organize.mlh.com/events/14711-frenchtoastfest/edit',
  );
  assert.equal(
    festEditUrl({ manageUrl: 'https://organize.mlh.com/events/14711' }),
    'https://organize.mlh.com/events/14711',
  );
});

/* No manage link, no CTA: the checks pane falls back to the email, which
   covers every failure anyway. */
test('festEditUrl is null without a manage link', () => {
  assert.equal(festEditUrl({ manageUrl: null }), null);
  assert.equal(festEditUrl({ manageUrl: '' }), null);
  assert.equal(festEditUrl({}), null);
  assert.equal(festEditUrl(null), null);
  assert.equal(festEditUrl(undefined), null);
});

/* The modal names the failing check in the host's own words, and falls back
   to a generic line for anything it has no sentence for. That fallback is a
   safety net, not a plan: a check the API can emit with no copy of its own
   would tell a host "one of your event details needs attention" and leave
   them to guess which. Every blocking check the two rule sets carry today
   gets its own label and its own sentence. */
test('every blocking check has host-facing copy of its own', () => {
  const BLOCKING = ['coordinates', 'name', 'duration'];
  for (const id of BLOCKING) {
    assert.ok(
      my.acknowledgements.checks.labels[id],
      `no label for the ${id} check`,
    );
    assert.ok(
      my.acknowledgements.checks.failures[id],
      `no failure sentence for the ${id} check`,
    );
  }
  // The advisory verdict never reaches the modal, but the pane still names it.
  assert.ok(my.acknowledgements.checks.labels.description);
});

/* The modal reuses the acknowledgements pane's sentences rather than
   restating them, so these are the only strings it adds. */
test('the failing rung carries its own badge, CTA and modal copy', () => {
  assert.ok(my.fests.eventBadges.checksFailed);
  assert.ok(my.fests.checksFailed.cta);
  assert.ok(my.fests.checksFailed.title);
  assert.ok(my.fests.checksFailed.intro);
  assert.ok(my.fests.checksFailed.listLead);
  assert.notEqual(
    my.fests.eventBadges.checksFailed,
    my.fests.eventBadges.checksUnderway,
  );
});

/* SELF_FIXABLE_CHECKS decides whether a host is handed the Organizer HQ
   form or the email. Coordinates are the one they cannot place themselves,
   so a set containing it must fall back to the email however many of the
   others are failing alongside. */
test("coordinates are not the host's to fix", () => {
  assert.ok(SELF_FIXABLE_CHECKS.has('name'));
  assert.ok(SELF_FIXABLE_CHECKS.has('duration'));
  assert.ok(!SELF_FIXABLE_CHECKS.has('coordinates'));
});

/* blockingCheckFailures is what both the badge and the modal read, so an
   absent or malformed set must be no failures rather than a guess. */
test('blockingCheckFailures degrades rather than accusing', () => {
  assert.deepEqual(blockingCheckFailures({}), []);
  assert.deepEqual(blockingCheckFailures({ publicationChecks: null }), []);
  assert.deepEqual(blockingCheckFailures({ publicationChecks: 'junk' }), []);
  assert.deepEqual(
    blockingCheckFailures({ publicationChecks: [null, undefined] }),
    [],
  );
  assert.deepEqual(
    blockingCheckFailures({
      publicationChecks: [{ id: 'description', passed: false }],
    }),
    [],
  );
  assert.deepEqual(
    blockingCheckFailures({
      publicationChecks: [
        { id: 'name', passed: false },
        { id: 'duration', passed: true },
      ],
    }),
    [{ id: 'name', passed: false }],
  );
});
