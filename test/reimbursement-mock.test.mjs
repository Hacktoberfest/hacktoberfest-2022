import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { submitReimbursement } = await import('../src/lib/reimbursement.mjs');

/* The modules read process.env at import time, so the sentinel must be set
   before this file's first import of them. node:test runs files in isolated
   processes, so setting it here is safe. */

test('the mocked build sends without a backend, after a beat', async () => {
  let fetched = false;
  globalThis.fetch = async () => {
    fetched = true;
    throw new Error('the mocked build must not call the network');
  };

  const started = Date.now();
  const submission = await submitReimbursement('fest-review-ready', {
    firstName: ' Jamie ',
    lastName: 'Rivera',
    email: 'jamie@sharkhacks.ca',
    readHandbook: true,
    agreedToPolicy: true,
  });

  assert.equal(fetched, false);
  assert.ok(Date.now() - started >= 500, 'the sending state should show');
  assert.ok(!Number.isNaN(Date.parse(submission.submittedAt)));
  assert.equal(submission.byYou, true);
  assert.deepEqual(submission.payee, {
    firstName: 'Jamie',
    lastName: 'Rivera',
    email: 'jamie@sharkhacks.ca',
  });
});

/* The mocked build's ended Fests: one review link per state of the card,
   reachable at /my/fest/?id=… but listed on no scenario's /my, since an
   ended Fest on the hub would change what every other review link shows. */

const { getFestDashboard, normalizeDashboard } = await import(
  '../src/lib/festDashboard.mjs'
);
const { REVIEW_FESTS, SCENARIOS } = await import('../src/data/fixtures.mjs');
const { festHasEnded, hasFestDashboard } = await import('../src/lib/fests.mjs');
const { formatUsd, openingStep, wrapUpChecks } = await import(
  '../src/lib/reimbursement.mjs'
);

/* Any time after the last of them ends. */
const NOW = Date.parse('2026-09-30T12:00:00.000Z');

const reviewed = async (id) => {
  const { fest, dashboard } = await getFestDashboard(id);
  return { fest, dashboard };
};

const verdicts = (dashboard) =>
  wrapUpChecks(dashboard.reimbursement.checks).map((check) => check.verdict);

test('every review Fest is reachable, ended, and a host’s own', async () => {
  assert.ok(REVIEW_FESTS.length >= 9);
  for (const card of REVIEW_FESTS) {
    const { fest, dashboard } = await reviewed(card.id);
    assert.equal(fest.id, card.id);
    assert.ok(festHasEnded(fest, NOW), card.id);
    assert.ok(hasFestDashboard(fest), card.id);
    /* Read exactly as a live payload would be, so the raw fixture the
       mocked page renders is already in the normalized shape. */
    assert.deepEqual(
      normalizeDashboard({ fest, dashboard }).dashboard,
      dashboard,
      card.id,
    );
  }
});

test('no review Fest is listed on any scenario’s /my', () => {
  const listed = Object.values(SCENARIOS).flatMap((scenario) =>
    (scenario.fests || []).map((fest) => fest.id),
  );
  for (const fest of REVIEW_FESTS) {
    assert.ok(!listed.includes(fest.id), fest.id);
  }
});

test('not ready: one winner missing, photos in', async () => {
  const { fest, dashboard } = await reviewed('fest-review-not-ready');
  assert.equal(fest.country, 'Canada');
  assert.equal(dashboard.checkInsCount, 42);
  assert.equal(openingStep(dashboard.reimbursement), 1);
  assert.deepEqual(verdicts(dashboard), ['pass', 'pass', 'fail', 'pass']);
  assert.equal(formatUsd(dashboard.reimbursement.limit.amount), '$243.60');
  assert.equal(formatUsd(dashboard.reimbursement.limit.perCheckIn), '$5.80');
});

test('just ended: MLH and SmugMug not read yet', async () => {
  const { dashboard } = await reviewed('fest-review-pending');
  assert.equal(openingStep(dashboard.reimbursement), 1);
  assert.deepEqual(verdicts(dashboard), [
    'pass',
    'pending',
    'pending',
    'pending',
  ]);
});

test('winners pending while the other three pass, the common state until MLH grants access', async () => {
  const { dashboard } = await reviewed('fest-review-winners-pending');
  assert.equal(openingStep(dashboard.reimbursement), 1);
  assert.deepEqual(verdicts(dashboard), ['pass', 'pass', 'pending', 'pass']);
});

test('every fix line: nothing passes', async () => {
  const { dashboard } = await reviewed('fest-review-failing');
  assert.equal(openingStep(dashboard.reimbursement), 1);
  assert.deepEqual(verdicts(dashboard), ['fail', 'fail', 'fail', 'fail']);
  assert.equal(dashboard.reimbursement.checks.winners.missing.length, 2);
});

test('ready to claim', async () => {
  const { dashboard } = await reviewed('fest-review-ready');
  assert.equal(openingStep(dashboard.reimbursement), 2);
  assert.deepEqual(verdicts(dashboard), ['pass', 'pass', 'pass', 'pass']);
  assert.equal(dashboard.checkInsCount, 42);
  assert.equal(formatUsd(dashboard.reimbursement.limit.amount), '$243.60');
});

test('sent by you, and sent by a co-host', async () => {
  const mine = (await reviewed('fest-review-sent')).dashboard.reimbursement;
  const theirs = (await reviewed('fest-review-sent-cohost')).dashboard
    .reimbursement;

  assert.equal(openingStep(mine), 'sent');
  assert.equal(mine.submission.byYou, true);
  assert.equal(openingStep(theirs), 'sent');
  assert.equal(theirs.submission.byYou, false);
});

test('force-approved by MLH with checks still out', async () => {
  const { dashboard } = await reviewed('fest-review-approved');
  const { reimbursement } = dashboard;
  assert.equal(reimbursement.forceApproved, true);
  assert.equal(openingStep(reimbursement), 2);
  assert.ok(verdicts(dashboard).includes('pending'));
});

test('a country with no rate', async () => {
  const { fest, dashboard } = await reviewed('fest-review-no-rate');
  assert.equal(fest.country, 'Iraq');
  assert.equal(dashboard.reimbursement.limit, null);
  assert.equal(openingStep(dashboard.reimbursement), 2);
});

test('over 50 check-ins', async () => {
  const { dashboard } = await reviewed('fest-review-over-50');
  const { limit } = dashboard.reimbursement;
  assert.equal(dashboard.checkInsCount, 63);
  assert.equal(limit.checkIns, 63);
  assert.equal(limit.checkInsCounted, 50);
  assert.equal(formatUsd(limit.amount), '$290.00');
});

test('a Meet Up: thanks, not a claim', async () => {
  const { dashboard } = await reviewed('fest-review-meetup');
  assert.equal(dashboard.format, 'meetUp');
  assert.ok(dashboard.photos.uploadUrl);
  assert.ok(dashboard.photos.galleryUrl);
});

test('the Hack Days are Hack Days', async () => {
  for (const fest of REVIEW_FESTS) {
    if (fest.id === 'fest-review-meetup') continue;
    const { dashboard } = await reviewed(fest.id);
    assert.equal(dashboard.format, 'hackDay', fest.id);
  }
});
