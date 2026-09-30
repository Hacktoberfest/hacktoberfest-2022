import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';
import {
  TYPE_ORDER,
  chipsFor,
  earnedCount,
  filterActivities,
} from '../src/lib/activityFilters.mjs';

/* The pure half of the chips on /activities/. Chips derive from whatever
   the catalogue holds, so a type with no activities has no chip and a type
   that gains entries gains one without a code change. */

const merged = (over = {}) =>
  ACTIVITIES.map((activity) => ({
    ...activity,
    completed: false,
    completedAt: null,
    source: null,
    ...(over[activity.id] || {}),
  }));

test('the type order is fixed', () => {
  assert.deepEqual(TYPE_ORDER, [
    'dev',
    'livestreams',
    'ghw',
    'tools',
    'misc',
    'inperson',
  ]);
});

test('signed out: All plus one chip per type present, in order, with counts', () => {
  const chips = chipsFor(merged(), { signedIn: false });
  assert.equal(chips[0].key, 'all');
  assert.equal(chips[0].count, ACTIVITIES.length);
  const typeChips = chips.slice(1);
  assert.ok(typeChips.every((chip) => TYPE_ORDER.includes(chip.key)));
  assert.deepEqual(
    typeChips.map((chip) => chip.key),
    TYPE_ORDER.filter((type) => ACTIVITIES.some((a) => a.type === type)),
  );
  typeChips.forEach((chip) => {
    assert.equal(
      chip.count,
      ACTIVITIES.filter((a) => a.type === chip.key).length,
    );
  });
  assert.ok(!chips.some((chip) => chip.key === 'todo'));
});

test('a type with no activities gets no chip', () => {
  /* Every type has entries this season, so take one away: a catalogue
     with no Tools gets no Tools chip, and the others keep their order. */
  const withoutTools = merged().filter((activity) => activity.type !== 'tools');
  const chips = chipsFor(withoutTools, { signedIn: false });
  assert.ok(!chips.some((chip) => chip.key === 'tools'));
  assert.deepEqual(
    chips.slice(1).map((chip) => chip.key),
    TYPE_ORDER.filter((type) => withoutTools.some((a) => a.type === type)),
  );
});

test('signed in: Still to do is last and counts the undone', () => {
  const chips = chipsFor(merged({ fest: { completed: true } }), {
    signedIn: true,
  });
  const todo = chips[chips.length - 1];
  assert.equal(todo.key, 'todo');
  assert.equal(todo.count, ACTIVITIES.length - 1);
});

/* The catalogue's ids grouped by type in the chips' order, keeping the
   catalogue's order within each type. */
const grouped = (activities) =>
  TYPE_ORDER.flatMap((type) =>
    activities.filter((a) => a.type === type).map((a) => a.id),
  );

test('the list is grouped by type in chip order, catalogue order within', () => {
  const list = merged({ fest: { completed: true } });
  const ids = filterActivities(list, 'all').map((a) => a.id);
  assert.deepEqual(ids, grouped(ACTIVITIES));
  assert.equal(ids.length, ACTIVITIES.length);
  assert.deepEqual(ids.slice(0, 2), ['dev-connect', 'dev-launch-weekend']);
  assert.deepEqual(ids.slice(-2), ['fest', 'host-fest']);
  assert.deepEqual(
    filterActivities(list, 'nonsense').map((a) => a.id),
    ids,
  );
  assert.deepEqual(
    list.map((a) => a.id),
    ACTIVITIES.map((a) => a.id),
  );
});

test('filtering drops only the others and keeps the grouped order', () => {
  const list = merged({ fest: { completed: true } });
  assert.deepEqual(
    filterActivities(list, 'ghw').map((a) => a.id),
    ACTIVITIES.filter((a) => a.type === 'ghw').map((a) => a.id),
  );
  assert.deepEqual(
    filterActivities(list, 'todo').map((a) => a.id),
    grouped(ACTIVITIES).filter((id) => id !== 'fest'),
  );
});

test('a type the order does not know sorts last', () => {
  const list = [{ id: 'odd', type: 'mystery' }, ...merged()];
  const ids = filterActivities(list, 'all').map((a) => a.id);
  assert.equal(ids[ids.length - 1], 'odd');
});

test('earnedCount counts completed activities only', () => {
  assert.equal(earnedCount(merged()), 0);
  assert.equal(
    earnedCount(
      merged({ fest: { completed: true }, ghw: { completed: true } }),
    ),
    2,
  );
  assert.equal(earnedCount(null), 0);
});
