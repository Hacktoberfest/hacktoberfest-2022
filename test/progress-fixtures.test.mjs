import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_SCENARIO,
  SCENARIOS,
  selectScenario,
} from '../src/data/fixtures.mjs';
import { festDidNotAttend } from '../src/lib/fests.mjs';

/* This file evaluates experience.mjs in the mocked build. Leaving the
   variable unset used to be enough; unset resolves to the live origin now
   (lib/apiBase.mjs), so the opt-out has to be spelled — and set before a
   dynamic import, because session.mjs reads it once at module-evaluation
   time and static imports are hoisted above this line. */
process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { getExperience } = await import('../src/lib/experience.mjs');

test('selectScenario falls back to the default for junk input', () => {
  assert.equal(selectScenario(null), DEFAULT_SCENARIO);
  assert.equal(selectScenario(''), DEFAULT_SCENARIO);
  assert.equal(selectScenario('nonsense'), DEFAULT_SCENARIO);
  assert.equal(selectScenario(42), DEFAULT_SCENARIO);
});

test('selectScenario passes through every known name', () => {
  [
    'eligible',
    'no-address',
    'nothing-done',
    'organizer',
    'complete',
    'error',
    'mlh-down',
  ].forEach((name) => assert.equal(selectScenario(name), name));
});

test('every fixture carries a user', () => {
  Object.values(SCENARIOS).forEach((fixture) =>
    assert.match(fixture.user.email, /@/),
  );
});

test('getExperience resolves the requested fixture', async () => {
  const result = await getExperience(null, { scenario: 'eligible' });
  assert.equal(result.addressValidated, true);
});

test('getExperience defaults to the no-address scenario', async () => {
  const result = await getExperience(null);
  assert.equal(result.addressValidated, false);
});

/* This file evaluates experience.mjs with NEXT_PUBLIC_API_BASE_URL=mocked --
   node:test gives each file its own process -- so these two are the mocked
   half of the pair. Their live half is in test/progress-experience.test.mjs:
   the same two scenarios must NOT throw when a real API base URL is set. Both
   halves are needed; either alone would pass with the guard removed. */
test('the error scenario rejects rather than resolving', async () => {
  await assert.rejects(
    () => getExperience(null, { scenario: 'error' }),
    /Mock experience failure/,
  );
});

/* The outage state's review link. It has to reject with the status intact,
   because that is what pageStateForError branches on -- a rejection without
   one shows the generic error screen, and the scenario would quietly review
   the wrong state. */
test('the mlh-down scenario rejects with a 502 so /my shows the outage state', async () => {
  await assert.rejects(
    () => getExperience(null, { scenario: 'mlh-down' }),
    (error) => {
      assert.equal(error.status, 502);
      assert.match(error.message, /Mock MLH outage/);
      return true;
    },
  );
});

test('every fixture carries a fests array with well-formed entries', () => {
  Object.values(SCENARIOS).forEach((fixture) => {
    assert.ok(Array.isArray(fixture.fests), 'fests must be an array');
    fixture.fests.forEach((fest) => {
      assert.equal(typeof fest.id, 'string');
      assert.equal(typeof fest.name, 'string');
      // Application cards have no venue yet, so city/country may be null —
      // but only on application cards.
      assert.ok(typeof fest.city === 'string' || fest.city === null);
      assert.ok(typeof fest.country === 'string' || fest.country === null);
      assert.ok(
        fest.applicationStatus !== null ||
          (typeof fest.city === 'string' && typeof fest.country === 'string'),
      );
      assert.match(fest.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(['attending', 'organizing'].includes(fest.role));
      // Participations carry a status; organized events have none (null),
      // matching the live card shape.
      assert.ok([null, 'registered', 'checked_in'].includes(fest.status));
      assert.ok(
        fest.role === 'organizing'
          ? fest.status === null
          : fest.status !== null,
      );
      // An event application in flight is always an organizing card with
      // the manage link its CTA needs; every other card carries the two
      // fields as nulls, matching the live payload's exact key set.
      assert.ok(
        [null, 'draft', 'submitted', 'approved', 'rejected'].includes(
          fest.applicationStatus,
        ),
      );
      assert.ok(typeof fest.manageUrl === 'string' || fest.manageUrl === null);
      if (fest.applicationStatus !== null) {
        assert.equal(fest.role, 'organizing');
        assert.equal(typeof fest.manageUrl, 'string');
        assert.equal(fest.registrationUrl, null);
      }
      assert.ok(typeof fest.startTime === 'string' || fest.startTime === null);
      assert.ok(typeof fest.endTime === 'string' || fest.endTime === null);
      assert.ok(typeof fest.endsAt === 'string' || fest.endsAt === null);
      assert.ok('registrationUrl' in fest);
    });
  });
});

test('the organizer scenario shows every badge variant', () => {
  const roles = SCENARIOS.organizer.fests.map((f) => f.role).sort();
  assert.deepEqual(roles, [
    'attending',
    'attending',
    'attending',
    'organizing',
    'organizing',
    'organizing',
    'organizing',
    'organizing',
    'organizing',
  ]);
  // Both tenses of the hosting badge: one organized fest still ahead, one
  // already past at any campaign-time "now".
  const organizingDates = SCENARIOS.organizer.fests
    .filter((f) => f.role === 'organizing' && f.applicationStatus === null)
    .map((f) => f.date);
  assert.ok(organizingDates.some((d) => d < '2026-09-01'));
  assert.ok(organizingDates.some((d) => d >= '2026-09-01'));
  const statuses = SCENARIOS.organizer.fests.map((f) => f.status);
  assert.ok(statuses.includes('registered'));
  assert.ok(statuses.includes('checked_in'));
  // The in-flight application cards, badges and CTAs included — one on
  // each rung, so every application badge variant renders. The approved
  // one's manageUrl is the Organizer HQ event page (the API swaps it at
  // that rung), which the "Manage event" CTA needs to be reviewable.
  assert.ok(
    SCENARIOS.organizer.fests.some(
      (f) => f.applicationStatus === 'draft' && f.manageUrl,
    ),
  );
  assert.ok(
    SCENARIOS.organizer.fests.some(
      (f) => f.applicationStatus === 'submitted' && f.manageUrl,
    ),
  );
  // Revisions required: MLH sent the application back, and its CTA
  // returns the host to the same MLH form the draft rung links.
  assert.ok(
    SCENARIOS.organizer.fests.some(
      (f) =>
        f.applicationStatus === 'rejected' &&
        f.manageUrl &&
        /\/applications\//.test(f.manageUrl),
    ),
  );
  assert.ok(
    SCENARIOS.organizer.fests.some(
      (f) =>
        f.applicationStatus === 'approved' &&
        f.manageUrl &&
        /\/events\//.test(f.manageUrl),
    ),
  );
  // The derived fourth variant: registered with an endsAt twelve-plus hours
  // gone renders "Did not attend" at any campaign-time "now".
  assert.ok(
    SCENARIOS.organizer.fests.some((f) =>
      festDidNotAttend(f, Date.parse('2026-10-01T00:00:00.000Z')),
    ),
  );
  // One fest is dated before the campaign so a past-dated card is always
  // present whenever this fixture is viewed.
  assert.ok(SCENARIOS.organizer.fests.some((f) => f.date < '2026-09-01'));
});

test('nothing-done has zero fests, exercising the invitation state', () => {
  assert.deepEqual(SCENARIOS['nothing-done'].fests, []);
  assert.ok(SCENARIOS['nothing-done'].activities.every((a) => !a.completed));
});

test('eligible completes the fest activity with a matching past fest', () => {
  assert.ok(
    SCENARIOS.eligible.activities.some((a) => a.id === 'fest' && a.completed),
  );
  assert.ok(SCENARIOS.eligible.fests.some((f) => f.date < '2026-09-01'));
});
