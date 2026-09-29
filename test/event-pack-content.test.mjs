import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { PACK_ITEMS } from '../src/lib/festDashboard.mjs';

const { pack } = my.dashboard;

/* The strings a host reads on the event pack card. The not-shipped line is
   also pinned by fest-dashboard-page.test.mjs, which proves it never bakes
   into the static export. */

test('the three journey steps read as briefed', () => {
  assert.equal(
    pack.steps.fulfillment,
    'Event pack shipped to fulfillment centre',
  );
  assert.equal(pack.steps.packed, 'Packed event pack for delivery');
  assert.equal(pack.steps.shipped, 'Event pack shipped to you');
});

test('each step state has a status word', () => {
  assert.equal(pack.stepStatus.done, 'Done');
  assert.equal(pack.stepStatus.active, 'In progress');
  assert.equal(pack.stepStatus.todo, 'Not yet');
});

test('the not-shipped line keeps its wording and gains a hint', () => {
  assert.equal(pack.notShipped, 'Your event pack has not yet shipped.');
  assert.equal(
    pack.notShippedHint,
    'Your event pack’s tracking number will appear here shortly after it ships.',
  );
});

test('the shipped line counts packages only when there is more than one', () => {
  assert.equal(pack.shipped, 'Your event pack is on its way.');
  assert.equal(
    pack.shippedMany(2),
    'Your event pack is on its way in 2 packages.',
  );
});

test('the row actions name the carrier when there is one', () => {
  assert.equal(pack.trackingLabel, 'Tracking');
  assert.equal(pack.trackCta('FedEx'), 'Track with FedEx');
  assert.equal(pack.lookUpCta, 'Look up this number');
  assert.equal(pack.copyCta, 'Copy');
  assert.equal(pack.copiedCta, 'Copied');
  assert.equal(pack.copyFailedCta, 'Select and copy');
  assert.equal(pack.unknownCarrier, 'Carrier');
  assert.equal(
    pack.unknownCarrierHint,
    'We could not tell which carrier this is. Paste the number into your carrier’s tracking page.',
  );
});

/* The packing list, from Jacklyn's "Pre-event Host Features Needed for /my"
   doc, as approved in the preview on 2026-09-28. */

test('the box is labelled and names each item', () => {
  assert.equal(pack.box.label, 'In your box');
  assert.deepEqual(pack.box.items, {
    arduino: 'Arduino',
    tshirts: 'T-shirts',
    beltBags: 'Belt bags',
    infoCards: 'Information cards',
    stickers: 'Stickers',
  });
});

test('every item the page can list has a label', () => {
  for (const item of PACK_ITEMS) {
    assert.equal(typeof pack.box.items[item], 'string', item);
  }
});

test('the estimate note keeps the doc’s wording', () => {
  assert.equal(
    pack.box.estimateLead,
    'This is an estimate for your planning purposes.',
  );
  assert.equal(
    pack.box.estimateBody,
    'Please double check your box to verify exact items and quantities before promising inventory to participants. If your box contents differ from this list, please reach out to us at',
  );
  assert.equal(pack.box.email, 'hacktoberfest@mlh.io');
});

test('a Fest the sheet has no row for is told its list is coming', () => {
  assert.equal(
    pack.box.pending,
    'Your box’s contents will appear here once we have confirmed them.',
  );
});

test('no em dashes in the box copy', () => {
  assert.equal(JSON.stringify(pack.box).includes('—'), false);
});
