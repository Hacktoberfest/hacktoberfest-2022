import assert from 'node:assert/strict';
import test from 'node:test';

import { checkInsVisible } from '../src/lib/fests.mjs';

/* 2026-10-07T09:00Z is the 7th in London and the 7th in Auckland (22:00),
   while 2026-10-06T20:00Z is still the 6th in London but already the 7th in
   Auckland. That pair is the whole point of the zone argument. */
const LONDON = { date: '2026-10-07', timeZone: 'Europe/London' };
const AUCKLAND = { date: '2026-10-07', timeZone: 'Pacific/Auckland' };

test('hidden before the day of the event', () => {
  assert.equal(
    checkInsVisible(LONDON, Date.parse('2026-10-06T20:00:00.000Z')),
    false,
  );
});

test('visible on the day of the event', () => {
  assert.equal(
    checkInsVisible(LONDON, Date.parse('2026-10-07T09:00:00.000Z')),
    true,
  );
});

test('stays visible after the event, so a past Fest keeps its count', () => {
  assert.equal(
    checkInsVisible(LONDON, Date.parse('2026-11-01T09:00:00.000Z')),
    true,
  );
});

test('the venue zone decides, not the reader', () => {
  // 20:00Z on the 6th is already the 7th in Auckland: a host whose Fest is
  // underway must not be looking at a hidden card.
  assert.equal(
    checkInsVisible(AUCKLAND, Date.parse('2026-10-06T20:00:00.000Z')),
    true,
  );
});

test('a missing zone falls back to the reader clock', () => {
  // A few hours of skew beats hiding a real number on the day.
  const noZone = { date: '2026-10-07', timeZone: null };
  assert.equal(typeof checkInsVisible(noZone, Date.now()), 'boolean');
  assert.equal(
    checkInsVisible(noZone, Date.parse('2027-01-01T00:00:00.000Z')),
    true,
  );
});

test('an unusable zone falls back rather than throwing', () => {
  const bad = { date: '2026-10-07', timeZone: 'Not/AZone' };
  assert.equal(
    checkInsVisible(bad, Date.parse('2027-01-01T00:00:00.000Z')),
    true,
  );
});

test('a fest with no usable date never shows the card', () => {
  assert.equal(
    checkInsVisible({ date: null, timeZone: 'UTC' }, Date.now()),
    false,
  );
  assert.equal(
    checkInsVisible({ date: 'soon', timeZone: 'UTC' }, Date.now()),
    false,
  );
  assert.equal(checkInsVisible(null, Date.now()), false);
});
