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
