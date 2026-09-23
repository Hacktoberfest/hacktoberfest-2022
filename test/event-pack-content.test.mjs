import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

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
