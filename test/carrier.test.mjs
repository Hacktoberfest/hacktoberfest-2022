import assert from 'node:assert/strict';
import test from 'node:test';

import { carrierFor } from '../src/lib/carrier.mjs';

/* Every pattern below was checked against the 23 real values MLH had
   written on 2026-09-23. A new carrier shape is the unknown case, never an
   error: the number still shows, it just does not claim a carrier. */

test('a 1Z number is UPS', () => {
  assert.deepEqual(carrierFor('1ZK943J80322840185'), {
    carrier: 'UPS',
    url: 'https://www.ups.com/track?tracknum=1ZK943J80322840185',
  });
});

test('the UPS prefix is matched regardless of case', () => {
  assert.equal(carrierFor('1zk943j80322840185').carrier, 'UPS');
});

test('a 22-digit number starting 9 is USPS', () => {
  assert.deepEqual(carrierFor('9434650206217265901828'), {
    carrier: 'USPS',
    url: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9434650206217265901828',
  });
});

test('a 20-digit number starting 9 is also USPS', () => {
  assert.equal(carrierFor('94346502062172659018').carrier, 'USPS');
});

test('a 12-digit number is FedEx', () => {
  assert.deepEqual(carrierFor('877489462372'), {
    carrier: 'FedEx',
    url: 'https://www.fedex.com/fedextrack/?trknbr=877489462372',
  });
});

test('a 15-digit number is FedEx', () => {
  assert.equal(carrierFor('877489462372123').carrier, 'FedEx');
});

test('an unrecognised shape has no carrier but still gets a link', () => {
  assert.deepEqual(carrierFor('AB123456789XY'), {
    carrier: null,
    url: 'https://www.google.com/search?q=AB123456789XY',
  });
});

test('surrounding whitespace does not change the answer', () => {
  assert.equal(carrierFor('  877489462372 ').carrier, 'FedEx');
  assert.equal(
    carrierFor('  877489462372 ').url,
    'https://www.fedex.com/fedextrack/?trknbr=877489462372',
  );
});

test('a non-string is the unknown case, not a crash', () => {
  assert.equal(carrierFor(null).carrier, null);
  assert.equal(carrierFor(42).carrier, null);
});
