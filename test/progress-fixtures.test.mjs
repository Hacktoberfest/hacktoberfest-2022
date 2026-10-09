import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_SCENARIO,
  SCENARIOS,
  selectScenario,
} from '../src/data/fixtures.mjs';
import { ACTIVITIES } from '../src/data/eligibility.mjs';
import { isEligible, progressLevel } from '../src/lib/eligibility.mjs';
import { festDidNotAttend, hasOnlyApplications } from '../src/lib/fests.mjs';
import { secretArt } from '../src/lib/secretStickers.mjs';
import {
  bookCounts,
  bookStickers,
  filterBook,
  milestoneState,
  rewardsState,
} from '../src/lib/stickerBook.mjs';

/* This file evaluates experience.mjs in the mocked build. Leaving the
   variable unset used to be enough; unset resolves to the live origin now
   (lib/apiBase.mjs), so the opt-out has to be spelled — and set before a
   dynamic import, because session.mjs reads it once at module-evaluation
   time and static imports are hoisted above this line. */
process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { getExperience } = await import('../src/lib/experience.mjs');
const { getProgress } = await import('../src/lib/progress.mjs');

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
    'applicant',
    'organizer',
    'complete',
    'completionist',
    'completionist-plus-plus',
    'completionist-plus-plus-pending',
    'error',
    'mlh-down',
  ].forEach((name) => assert.equal(selectScenario(name), name));
});

test('the fixtures actually represent the states they claim', () => {
  assert.equal(isEligible(SCENARIOS.eligible), true);
  assert.equal(isEligible(SCENARIOS['no-address']), false);
  assert.equal(SCENARIOS['no-address'].addressValidated, false);
  assert.equal(isEligible(SCENARIOS['nothing-done']), false);
  assert.equal(
    SCENARIOS['nothing-done'].activities.every((a) => !a.completed),
    true,
  );
});

test('the complete scenario reaches milestone 2', () => {
  assert.equal(progressLevel(SCENARIOS.complete), 2);
});

test('the completionist scenario reaches milestone 3', () => {
  assert.equal(progressLevel(SCENARIOS.completionist), 3);
});

/* The review links for the fourth card, /my's alone: twenty stickers in
   the book and the card earned, on the day the twentieth landed; and a
   Completionist four short, the card at sixteen of twenty. Neither carries
   the demo secrets, so the book's count is the catalogue's. */
test('the Completionist++ scenarios: earned at twenty, and pending at sixteen of twenty', () => {
  const earned = SCENARIOS['completionist-plus-plus'];
  const book = bookStickers(earned);
  assert.equal(progressLevel(earned), 4);
  assert.equal(bookCounts(book).earned, 20);
  const won = rewardsState(earned, book);
  assert.equal(won.completionistPlusPlus.earned, true);
  assert.equal(won.completionistPlusPlus.earnedAt, '2026-10-22');
  assert.equal(won.earnedRewards, 4);

  const pending = SCENARIOS['completionist-plus-plus-pending'];
  const near = rewardsState(pending, bookStickers(pending));
  assert.equal(progressLevel(pending), 3);
  assert.equal(near.completionist.earned, true);
  assert.equal(near.completionistPlusPlus.shown, true);
  assert.equal(near.completionistPlusPlus.earned, false);
  assert.equal(near.completionistPlusPlus.pips.length, 16);
  assert.equal(near.completionistPlusPlus.target, 20);

  assert.deepEqual(earned.secrets, []);
  assert.deepEqual(pending.secrets, []);
});

test('every fixture carries a user', () => {
  Object.values(SCENARIOS).forEach((fixture) =>
    assert.match(fixture.user.email, /@/),
  );
});

test('getExperience resolves the requested fixture', async () => {
  const result = await getExperience(null, { scenario: 'eligible' });
  assert.equal(isEligible(result), true);
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
      assert.ok(
        typeof fest.websiteUrl === 'string' || fest.websiteUrl === null,
      );
      // The publication trio ships on every card, nulls where not
      // applicable, matching the live payload's exact key set.
      assert.ok('mlhPublished' in fest);
      assert.ok('hacktoberfestPublished' in fest);
      assert.ok(
        typeof fest.acknowledgedAt === 'string' || fest.acknowledgedAt === null,
      );
      // The venue trio ships on every card too: the pin and address the
      // acknowledgements' map slide renders, nulls where not geocoded.
      assert.ok(typeof fest.latitude === 'number' || fest.latitude === null);
      assert.ok(typeof fest.longitude === 'number' || fest.longitude === null);
      assert.ok(
        typeof fest.venueAddress === 'string' || fest.venueAddress === null,
      );
      // The automated check verdicts ride organizing event cards only.
      assert.ok(
        fest.publicationChecks === null ||
          Array.isArray(fest.publicationChecks),
      );
    });
  });
});

test('the organizer scenario shows every badge variant', () => {
  const roles = SCENARIOS.organizer.fests.map((f) => f.role).sort();
  /* One organizing entry per rung, plus the co-branded Fest that carries a
     partner in its name - the split the hero and the directory both make. */
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
    'organizing',
    'organizing',
    'organizing',
    'organizing',
    'organizing',
    'organizing',
  ]);
  /* The two halves of the acknowledged-but-unlisted rung, which share
     every field except the verdicts: one waiting on the next sync, one
     failing a check and waiting on nobody. */
  const acknowledgedUnlisted = SCENARIOS.organizer.fests.filter(
    (f) =>
      f.role === 'organizing' &&
      f.applicationStatus === null &&
      f.mlhPublished &&
      !f.hacktoberfestPublished &&
      f.acknowledgedAt,
  );
  assert.ok(
    acknowledgedUnlisted.some((f) =>
      f.publicationChecks.every((c) => c.passed),
    ),
  );
  assert.ok(
    acknowledgedUnlisted.some((f) =>
      f.publicationChecks.some((c) => c.id === 'name' && !c.passed),
    ),
  );
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
  // Every event-card publication rung is reviewable from a share link.
  const organizingEvents = SCENARIOS.organizer.fests.filter(
    (f) => f.role === 'organizing' && f.applicationStatus === null,
  );
  assert.ok(
    organizingEvents.some(
      (f) => f.mlhPublished && !f.acknowledgedAt && !f.hacktoberfestPublished,
    ),
  );
  assert.ok(
    organizingEvents.some(
      (f) => f.mlhPublished && f.acknowledgedAt && !f.hacktoberfestPublished,
    ),
  );
  assert.ok(organizingEvents.some((f) => f.hacktoberfestPublished));
  assert.ok(
    organizingEvents.some((f) => f.mlhPublished === false && f.manageUrl),
  );
  // One card fails an automated check, so the warning pane is reviewable.
  assert.ok(
    organizingEvents.some((f) =>
      (f.publicationChecks ?? []).some((check) => !check.passed),
    ),
  );
});

test('nothing-done has zero fests, exercising the invitation state', () => {
  assert.deepEqual(SCENARIOS['nothing-done'].fests, []);
});

/* The review link for /my's hosting link in its applications wording. */
test('applicant is organizing through applications alone', () => {
  assert.equal(hasOnlyApplications(SCENARIOS.applicant.fests), true);
  assert.ok(SCENARIOS.applicant.fests.length > 1);
});

test('eligible completes the fest activity with a matching past fest', () => {
  assert.ok(
    SCENARIOS.eligible.activities.some((a) => a.id === 'fest' && a.completed),
  );
  assert.ok(SCENARIOS.eligible.fests.some((f) => f.date < '2026-09-01'));
});

test('every data fixture carries the required stickers, consistent with its address flag', () => {
  Object.entries(SCENARIOS)
    .filter(([, fixture]) => 'addressValidated' in fixture)
    .forEach(([name, fixture]) => {
      const byId = new Map(fixture.required.map((entry) => [entry.id, entry]));
      assert.equal(byId.get('signin').completed, true, name);
      assert.equal(
        byId.get('address').completed,
        fixture.addressValidated,
        `${name}: the address sticker follows addressValidated`,
      );
      fixture.required.forEach((entry) => {
        assert.equal(entry.completed, Boolean(entry.completedAt), name);
        assert.equal(entry.completed, entry.source !== null, name);
      });
    });
});

/* The review link for secret stickers: an invented one of each kind,
   revealed by a sticker the scenario has earned. */
test('the completionist scenario carries a demo secret, one earned and one placeholder', () => {
  const fixture = SCENARIOS.completionist;
  assert.deepEqual(
    fixture.secrets.map((secret) => [secret.id, secret.completed]),
    [
      ['demo-secret', true],
      ['secret-1', false],
    ],
  );
  fixture.secrets.forEach((secret) => {
    assert.equal(secret.secret, true);
    assert.equal(secret.required, false);
    assert.ok(
      fixture.activities.some(
        (activity) => activity.id === secret.revealedBy && activity.completed,
      ),
      `${secret.id}: revealed by a sticker the scenario has earned`,
    );
  });
  assert.equal(secretArt(fixture.secrets[0].art), fixture.secrets[0].art);
  assert.equal('name' in fixture.secrets[1], false);
  assert.equal('art' in fixture.secrets[1], false);
});

test('the completionist book ends their revealer’s page with the demo secrets and counts the earned one', () => {
  const book = bookStickers(SCENARIOS.completionist);
  const page = filterBook(book, 'ghw').map((sticker) => sticker.id);
  assert.deepEqual(page.slice(-2), ['demo-secret', 'secret-1']);
  assert.equal(page[0], 'ghw');
  const earnedActivities = SCENARIOS.completionist.activities.filter(
    (activity) => activity.completed,
  ).length;
  assert.deepEqual(bookCounts(book), {
    earned: 2 + earnedActivities + 1,
    total: 2 + ACTIVITIES.length + 2,
  });
  assert.equal(
    milestoneState(SCENARIOS.completionist).done,
    earnedActivities + 1,
  );
  assert.equal(progressLevel(SCENARIOS.completionist), 3);
});

test('the mocked seams hand the demo secrets on, signed in', async () => {
  const experience = await getExperience(null, { scenario: 'completionist' });
  assert.equal(experience.secrets.length, 2);
  const progress = await getProgress(
    { user: { email: 'ada@example.invalid' } },
    { scenario: 'completionist' },
  );
  assert.deepEqual(
    progress.secrets.map((secret) => secret.id),
    ['demo-secret', 'secret-1'],
  );
  assert.deepEqual((await getProgress(null)).secrets, []);
});
