import assert from 'node:assert/strict';
import test from 'node:test';

import {
  eventCardState,
  festDidNotAttend,
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
