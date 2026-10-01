import assert from 'node:assert/strict';
import test from 'node:test';

import {
  festEndTimerDelay,
  festHasEnded,
  scheduleFestEnd,
} from '../src/lib/fests.mjs';

/* A Fest's end is an instant, so these compare instants: no zone, no
   calendar. Toronto's Hack Day ends at 6:00 PM EDT, 22:00Z. */
const TORONTO = { endsAt: '2026-10-24T22:00:00.000Z' };
const END = Date.parse(TORONTO.endsAt);

test('a Fest has not ended before its end time', () => {
  assert.equal(festHasEnded(TORONTO, END - 1), false);
  assert.equal(
    festHasEnded(TORONTO, Date.parse('2026-10-24T14:00:00.000Z')),
    false,
  );
});

test('a Fest has ended at its end time and after', () => {
  assert.equal(festHasEnded(TORONTO, END), true);
  assert.equal(
    festHasEnded(TORONTO, Date.parse('2026-11-30T00:00:00.000Z')),
    true,
  );
});

test('a missing or unreadable end time reads as not ended', () => {
  for (const endsAt of [undefined, null, '', 'soon', 1761343200000, {}]) {
    assert.equal(festHasEnded({ endsAt }, END + 1), false, String(endsAt));
  }
  assert.equal(festHasEnded({}, END + 1), false);
  assert.equal(festHasEnded(null, END + 1), false);
});

test('an unreadable clock reads as not ended', () => {
  assert.equal(festHasEnded(TORONTO, Number.NaN), false);
  assert.equal(festHasEnded(TORONTO, undefined), false);
});

/* The page arms one timer for the end, so an open page flips without a
   reload. Browsers fire any delay over 2^31-1 ms at once, so a Fest more
   than about 24.8 days out gets no timer at all. */
const MAX_DELAY = 2147483647;

test('the timer waits exactly until the end', () => {
  assert.equal(festEndTimerDelay(TORONTO, END - 90_000), 90_000);
  assert.equal(festEndTimerDelay(TORONTO, END - 1), 1);
});

test('no timer once the Fest has ended', () => {
  assert.equal(festEndTimerDelay(TORONTO, END), null);
  assert.equal(festEndTimerDelay(TORONTO, END + 5_000), null);
});

test('no timer for an end further out than a browser can wait', () => {
  assert.equal(festEndTimerDelay(TORONTO, END - MAX_DELAY), MAX_DELAY);
  assert.equal(festEndTimerDelay(TORONTO, END - MAX_DELAY - 1), null);
});

test('no timer for a missing or unreadable end time', () => {
  assert.equal(festEndTimerDelay({ endsAt: null }, END - 1_000), null);
  assert.equal(festEndTimerDelay({ endsAt: 'soon' }, END - 1_000), null);
  assert.equal(festEndTimerDelay(null, END - 1_000), null);
  assert.equal(festEndTimerDelay(TORONTO, Number.NaN), null);
});

/* The page's one timer. The clock is read when the timer is armed, not
   taken from the page's `now`, which can be minutes old by the time the
   fetch lands and would make the flip late by exactly that much. */
const fakeTimers = (nowMs) => {
  const armed = [];
  const cleared = [];
  return {
    armed,
    cleared,
    clock: {
      now: () => nowMs,
      setTimer: (callback, delay) => {
        armed.push({ callback, delay });
        return armed.length;
      },
      clearTimer: (id) => cleared.push(id),
    },
  };
};

test('the timer is armed from the clock at arming time', () => {
  const { armed, clock } = fakeTimers(END - 60_000);
  let ended = 0;

  scheduleFestEnd(TORONTO, () => ended++, clock);

  assert.equal(armed.length, 1);
  assert.equal(armed[0].delay, 60_000);
  armed[0].callback();
  assert.equal(ended, 1);
});

test('the cleanup clears the armed timer', () => {
  const { armed, cleared, clock } = fakeTimers(END - 60_000);

  const cancel = scheduleFestEnd(TORONTO, () => {}, clock);
  cancel();

  assert.deepEqual(cleared, [armed.length]);
});

test('nothing is armed once the Fest has ended, or with no usable end', () => {
  for (const [fest, nowMs] of [
    [TORONTO, END],
    [TORONTO, END - MAX_DELAY - 1],
    [{ endsAt: null }, END - 1_000],
  ]) {
    const { armed, cleared, clock } = fakeTimers(nowMs);
    const cancel = scheduleFestEnd(fest, () => {}, clock);
    cancel();
    assert.equal(armed.length, 0);
    assert.equal(cleared.length, 0);
  }
});
