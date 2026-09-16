import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

/* The inventory band's copy (my.inventory): the words around the API's
   items, never the items themselves. The name, the two facts and the CTA
   of every thing come from GET /api/me/items. */

const strings = (value) =>
  typeof value === 'string'
    ? [value]
    : typeof value === 'function'
      ? strings(value(3, 'October 5'))
      : value && typeof value === 'object'
        ? Object.values(value).flatMap(strings)
        : [];

test('the two kinds are named, and unearned things have no words: they are not shown', () => {
  const { kinds } = my.inventory;
  assert.equal(typeof kinds.physical, 'string');
  assert.equal(typeof kinds.digital, 'string');
  assert.equal(my.inventory.notYet, undefined);
  assert.equal(typeof my.inventory.devUnlinked, 'string');
  assert.equal(typeof my.inventory.downloads.pdf, 'string');
  assert.equal(typeof my.inventory.downloads.png, 'string');
  assert.equal(typeof my.inventory.downloads.failed, 'string');
  assert.equal(typeof my.inventory.devUnlinkedNote, 'string');
});

test('no item copy lives here', () => {
  assert.equal(my.inventory.items, undefined);
  assert.equal(my.inventory.locked, undefined);
  assert.equal(my.inventory.drawer.empty, undefined);
  assert.equal(typeof my.inventory.nothing, 'string');
});

test('the locker never claims a number of slots', () => {
  const { count, room, full } = my.inventory;
  assert.equal(count(0), '0 things');
  assert.equal(count(1), '1 thing');
  assert.equal(count(7), '7 things');
  [room, full].forEach((line) => {
    assert.doesNotMatch(line, /\d/, `a number in "${line}"`);
    assert.doesNotMatch(line, /slots/, `slots counted in "${line}"`);
  });
});

test('the copy says hosts, never organizers, and carries no em dashes', () => {
  const all = strings(my.inventory);
  assert.ok(all.length > 10);
  all.forEach((line) => {
    assert.doesNotMatch(line, /—/, `em dash in "${line}"`);
    assert.doesNotMatch(line, /organi[sz]er/i, `organizer in "${line}"`);
  });
});
