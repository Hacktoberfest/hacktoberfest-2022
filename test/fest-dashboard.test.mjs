import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeDashboard, PACK_ITEMS } from '../src/lib/festDashboard.mjs';
import { usefulInfo } from '../src/lib/usefulInfo.mjs';

const body = {
  fest: { id: 'fest-tokyo', name: 'Hacktoberfest Hack Day Tokyo' },
  dashboard: {
    registrationsCount: 17,
    checkInsCount: 4,
    trackingNumbers: ['1Z999'],
  },
};

test('a complete payload passes through', () => {
  const result = normalizeDashboard(body);

  assert.equal(result.fest.id, 'fest-tokyo');
  assert.deepEqual(result.dashboard, {
    registrationsCount: 17,
    checkInsCount: 4,
    trackingNumbers: ['1Z999'],
  });
});

test('missing counts read as zero', () => {
  // The deploy-order seam: an API answering without these fields degrades to
  // zeros rather than rendering undefined at a host.
  const result = normalizeDashboard({ fest: body.fest, dashboard: {} });

  assert.equal(result.dashboard.registrationsCount, 0);
  assert.equal(result.dashboard.checkInsCount, 0);
});

test('a missing dashboard object still yields a renderable page', () => {
  const result = normalizeDashboard({ fest: body.fest });

  assert.deepEqual(result.dashboard, {
    registrationsCount: 0,
    checkInsCount: 0,
    trackingNumbers: [],
  });
});

test('non-numeric counts read as zero', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { registrationsCount: '17', checkInsCount: null },
  });

  assert.equal(result.dashboard.registrationsCount, 0);
  assert.equal(result.dashboard.checkInsCount, 0);
});

test('tracking entries that are not usable strings are dropped', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { trackingNumbers: ['1Z999', '', 42, null] },
  });

  assert.deepEqual(result.dashboard.trackingNumbers, ['1Z999']);
});

test('a non-array tracking value reads as nothing shipped', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { trackingNumbers: '1Z999' },
  });

  assert.deepEqual(result.dashboard.trackingNumbers, []);
});

test('a payload with no fest is not a page', () => {
  assert.equal(normalizeDashboard({ dashboard: body.dashboard }), null);
  assert.equal(normalizeDashboard(null), null);
});

/* The check-in code. The API sends it only to the Fest's hosts; this seam
   only decides how the page reads what arrives. */

test('a check-in code passes through, trimmed', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { checkInCode: ' K7RQ2W ' },
  });

  assert.equal(result.dashboard.checkInCode, 'K7RQ2W');
});

test('a code that is null, empty or not a string reads as no code', () => {
  for (const checkInCode of [null, '', '   ', 42, {}]) {
    const result = normalizeDashboard({
      fest: body.fest,
      dashboard: { checkInCode },
    });

    assert.equal(result.dashboard.checkInCode, null);
  }
});

test('an API that sends no code key leaves the key off, so no card renders', () => {
  const result = normalizeDashboard(body);

  assert.equal('checkInCode' in result.dashboard, false);
});

/* The Photo gallery. The API sends `photos` only to the Fest's hosts, and
   only once it knows about photos at all. */

const gallery =
  'https://majorleaguehacking.smugmug.com/Event-Photos/Hacktoberfest-2026/Tokyo/n-AbC123';
const upload = 'https://majorleaguehacking.smugmug.com/upload/AbC123/upload';

test('the SmugMug links pass through, trimmed', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { photos: { galleryUrl: ` ${gallery} `, uploadUrl: upload } },
  });

  assert.deepEqual(result.dashboard.photos, {
    galleryUrl: gallery,
    uploadUrl: upload,
  });
});

test('links MLH has not sent yet read as null, so the card says they are coming', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { photos: { galleryUrl: null, uploadUrl: null } },
  });

  assert.deepEqual(result.dashboard.photos, {
    galleryUrl: null,
    uploadUrl: null,
  });
});

test('a link that is not https never reaches an href', () => {
  for (const value of ['http://example.com', 'javascript:alert(1)', '', 42]) {
    const result = normalizeDashboard({
      fest: body.fest,
      dashboard: { photos: { galleryUrl: value, uploadUrl: value } },
    });

    assert.deepEqual(result.dashboard.photos, {
      galleryUrl: null,
      uploadUrl: null,
    });
  }
});

test('an unreadable photos value reads as no links yet', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { photos: null },
  });

  assert.deepEqual(result.dashboard.photos, {
    galleryUrl: null,
    uploadUrl: null,
  });
});

test('an API that sends no photos key leaves the key off, so no card renders', () => {
  const result = normalizeDashboard(body);

  assert.equal('photos' in result.dashboard, false);
});

/* The Useful info card's two facts. The API sends them only on the host's
   own dashboard; this seam only decides how the page reads what arrives,
   and lib/usefulInfo.mjs decides what the card shows. */

test('the format and partners pass through', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { format: 'hackDay', partners: ['snowflake', 'gemma'] },
  });

  assert.equal(result.dashboard.format, 'hackDay');
  assert.deepEqual(result.dashboard.partners, ['snowflake', 'gemma']);
});

test('a Meetup and its (blanked) partners pass through', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { format: 'meetUp', partners: [] },
  });

  assert.equal(result.dashboard.format, 'meetUp');
  assert.deepEqual(result.dashboard.partners, []);
});

test('a format that is neither Hack Day nor Meetup reads as unknown', () => {
  for (const value of [null, 'hackathon', 'Hack Day', 'meetup', '', 42, {}]) {
    const result = normalizeDashboard({
      fest: body.fest,
      dashboard: { format: value, partners: [] },
    });

    assert.equal(result.dashboard.format, null, String(value));
  }
});

test('partner entries that are not strings are dropped', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { format: 'hackDay', partners: ['gemma', 42, null, 'solana'] },
  });

  assert.deepEqual(result.dashboard.partners, ['gemma', 'solana']);
});

test('a partners value that is not a list reads as unknown, so no card renders', () => {
  for (const value of [null, 'gemma', { gemma: true }, 42]) {
    const result = normalizeDashboard({
      fest: body.fest,
      dashboard: { format: 'hackDay', partners: value },
    });

    assert.equal(result.dashboard.partners, null, String(value));
    assert.equal(usefulInfo(result.dashboard), null, String(value));
  }
});

test('an API that sends neither key leaves both off, so no card renders', () => {
  const result = normalizeDashboard(body);

  assert.equal('format' in result.dashboard, false);
  assert.equal('partners' in result.dashboard, false);
  assert.equal(usefulInfo(result.dashboard), null);
});

/* The event pack's contents, from MLH's shipping sheet. The API sends them
   only to the Fest's hosts, and only once it knows about them at all. */

test('the pack items are the five the sheet has, in display order', () => {
  assert.deepEqual(PACK_ITEMS, [
    'arduino',
    'tshirts',
    'beltBags',
    'infoCards',
    'stickers',
  ]);
});

test('pack items pass through in display order, once each', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { packContents: ['stickers', 'tshirts', 'stickers', 'arduino'] },
  });

  assert.deepEqual(result.dashboard.packContents, [
    'arduino',
    'tshirts',
    'stickers',
  ]);
});

test('an item this build has no label for never reaches the page', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { packContents: ['lanyards', 3, null, 'beltBags'] },
  });

  assert.deepEqual(result.dashboard.packContents, ['beltBags']);
});

test('no sheet row, or an unreadable value, reads as an empty box', () => {
  for (const packContents of [null, [], 'stickers', { stickers: true }]) {
    const result = normalizeDashboard({
      fest: body.fest,
      dashboard: { packContents },
    });

    assert.deepEqual(result.dashboard.packContents, [], String(packContents));
  }
});

test('an API that sends no packContents key leaves the key off, so no box renders', () => {
  const result = normalizeDashboard(body);

  assert.equal('packContents' in result.dashboard, false);
});

/* The reimbursement block, sent for every Fest once the API knows about
   wrap-up at all. Everything in it decides money on a host's screen, so
   every field is read defensively: bad data degrades to "still checking",
   no limit, or no submission, and never to eligible. */

const REIMBURSEMENT = {
  checks: {
    checkIns: true,
    submissions: true,
    winners: { missing: ['Best Use of Gemma 4'] },
    photos: { count: 86 },
  },
  forceApproved: false,
  eligible: false,
  limit: {
    country: 'Canada',
    perCheckIn: 5.8,
    checkIns: 42,
    checkInsCounted: 42,
    amount: 243.6,
  },
  submission: null,
};

const reimbursementOf = (value) =>
  normalizeDashboard({
    fest: body.fest,
    dashboard: { reimbursement: value },
  }).dashboard.reimbursement;

test('a reimbursement block passes through', () => {
  assert.deepEqual(reimbursementOf(REIMBURSEMENT), REIMBURSEMENT);
});

test('an API that sends no reimbursement key leaves it off, so no card renders', () => {
  const result = normalizeDashboard(body);

  assert.equal('reimbursement' in result.dashboard, false);
});

test('a reimbursement value that is not an object reads as null', () => {
  for (const value of [null, true, 'eligible', 42, []]) {
    assert.equal(reimbursementOf(value), null, String(value));
  }
});

test('a missing checks object reads as nothing checked yet', () => {
  assert.deepEqual(reimbursementOf({}).checks, {
    checkIns: false,
    submissions: null,
    winners: null,
    photos: null,
  });
});

test('check-ins pass only on a literal true', () => {
  for (const checkIns of [1, 'true', null, undefined, {}]) {
    const checks = reimbursementOf({ checks: { checkIns } }).checks;
    assert.equal(checks.checkIns, false, String(checkIns));
  }
});

test('submissions keep true and false, and anything else is still checking', () => {
  assert.equal(
    reimbursementOf({ checks: { submissions: true } }).checks.submissions,
    true,
  );
  assert.equal(
    reimbursementOf({ checks: { submissions: false } }).checks.submissions,
    false,
  );
  for (const submissions of [null, 1, 'yes', {}]) {
    const checks = reimbursementOf({ checks: { submissions } }).checks;
    assert.equal(checks.submissions, null, String(submissions));
  }
});

test('winners keep the names still missing, trimmed', () => {
  const checks = reimbursementOf({
    checks: { winners: { missing: [' Best Use of Gemma 4 ', 'Best UI'] } },
  }).checks;

  assert.deepEqual(checks.winners, {
    missing: ['Best Use of Gemma 4', 'Best UI'],
  });
});

test('every challenge with a winner, or no challenges at all, is an empty list', () => {
  const checks = reimbursementOf({
    checks: { winners: { missing: [] } },
  }).checks;

  assert.deepEqual(checks.winners, { missing: [] });
});

test('winners without a readable list are still checking', () => {
  for (const winners of [null, [], 'Best UI', { missing: 'Best UI' }]) {
    const checks = reimbursementOf({ checks: { winners } }).checks;
    assert.equal(checks.winners, null, JSON.stringify(winners));
  }
});

test('a missing list whose names are all unreadable is still checking, never a pass', () => {
  const checks = reimbursementOf({
    checks: { winners: { missing: [42, '', null] } },
  }).checks;

  assert.equal(checks.winners, null);
});

test('unreadable names drop out when readable ones remain', () => {
  const checks = reimbursementOf({
    checks: { winners: { missing: [42, 'Best UI'] } },
  }).checks;

  assert.deepEqual(checks.winners, { missing: ['Best UI'] });
});

test('photos keep a whole, non-negative count', () => {
  assert.deepEqual(
    reimbursementOf({ checks: { photos: { count: 0 } } }).checks.photos,
    { count: 0 },
  );
  for (const photos of [null, { count: -1 }, { count: 2.5 }, { count: '86' }]) {
    const checks = reimbursementOf({ checks: { photos } }).checks;
    assert.equal(checks.photos, null, JSON.stringify(photos));
  }
});

test('eligible and force-approved hold only on a literal true', () => {
  for (const value of [1, 'true', null, undefined, {}]) {
    const result = reimbursementOf({ eligible: value, forceApproved: value });
    assert.equal(result.eligible, false, String(value));
    assert.equal(result.forceApproved, false, String(value));
  }
  const approved = reimbursementOf({ eligible: true, forceApproved: true });
  assert.equal(approved.eligible, true);
  assert.equal(approved.forceApproved, true);
});

test('a limit with any unreadable field reads as no limit', () => {
  const broken = [
    { country: '' },
    { country: 42 },
    { perCheckIn: 0 },
    { perCheckIn: '5.8' },
    { checkIns: -1 },
    { checkIns: 4.5 },
    { checkInsCounted: '42' },
    { checkInsCounted: 43 },
    { amount: -1 },
    { amount: Number.NaN },
  ];

  for (const change of broken) {
    const limit = { ...REIMBURSEMENT.limit, ...change };
    assert.equal(
      reimbursementOf({ limit }).limit,
      null,
      JSON.stringify(change),
    );
  }
  assert.equal(reimbursementOf({ limit: null }).limit, null);
  assert.equal(reimbursementOf({ limit: 'Canada' }).limit, null);
});

test('a limit over the cap passes through with both counts', () => {
  const limit = {
    country: 'Canada',
    perCheckIn: 5.8,
    checkIns: 63,
    checkInsCounted: 50,
    amount: 290,
  };

  assert.deepEqual(reimbursementOf({ limit }).limit, limit);
});

test('a submission passes through, the payee trimmed', () => {
  const submission = {
    submittedAt: '2026-10-25T15:12:00.000Z',
    byYou: true,
    payee: {
      firstName: ' Jamie ',
      lastName: 'Rivera',
      email: 'jamie@sharkhacks.ca ',
    },
  };

  assert.deepEqual(reimbursementOf({ submission }).submission, {
    submittedAt: '2026-10-25T15:12:00.000Z',
    byYou: true,
    payee: {
      firstName: 'Jamie',
      lastName: 'Rivera',
      email: 'jamie@sharkhacks.ca',
    },
  });
});

test('a submission with no readable time is no submission', () => {
  for (const submittedAt of [undefined, null, '', 'yesterday', 1761405120000]) {
    const result = reimbursementOf({
      submission: { submittedAt, byYou: true, payee: {} },
    });
    assert.equal(result.submission, null, String(submittedAt));
  }
  assert.equal(reimbursementOf({ submission: true }).submission, null);
});

test('a submission is by a co-host unless the API says otherwise, and keeps its time without a payee', () => {
  const result = reimbursementOf({
    submission: { submittedAt: '2026-10-25T15:12:00.000Z', payee: null },
  });

  assert.deepEqual(result.submission, {
    submittedAt: '2026-10-25T15:12:00.000Z',
    byYou: false,
    payee: { firstName: '', lastName: '', email: '' },
  });
});
