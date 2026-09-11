import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MILESTONE_IDS,
  SEEN_STICKERS_KEY,
  earnedIds,
  milestoneIds,
  newlyEarned,
  noteEarned,
  readSeen,
  writeSeen,
} from '../src/lib/justEarned.mjs';
import { openingTab } from '../src/lib/stickerBook.mjs';

const SESSION = { accessToken: 'a', user: { email: 'ada@example.invalid' } };
const OTHER = { accessToken: 'b', user: { email: 'bob@example.invalid' } };

/* A minimal localStorage, handed in: the real one is absent under node. */
const storage = (initial) => {
  const map = new Map(Object.entries(initial || {}));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    dump: () => Object.fromEntries(map),
  };
};

test('earnedIds is the completed stickers in book order, junk dropped', () => {
  assert.deepEqual(
    earnedIds([
      { id: 'signin', completed: true },
      { id: 'fest', completed: false },
      { id: 'dev-connect', completed: true },
      null,
      { completed: true },
    ]),
    ['signin', 'dev-connect'],
  );
  assert.deepEqual(earnedIds(null), []);
});

test('milestoneIds names each reached reward under its own id', () => {
  const rewards = (pack, complete, completionist) => ({
    pack: { earned: pack },
    completion: { earned: complete },
    completionist: { earned: completionist },
  });
  assert.deepEqual(milestoneIds(rewards(false, false, false)), []);
  assert.deepEqual(milestoneIds(rewards(true, false, false)), [
    MILESTONE_IDS.pack,
  ]);
  assert.deepEqual(milestoneIds(rewards(true, true, true)), [
    MILESTONE_IDS.pack,
    MILESTONE_IDS.complete,
    MILESTONE_IDS.completionist,
  ]);
  assert.deepEqual(milestoneIds(null), []);
});

test('newlyEarned: nothing is new on a first look, only what the record lacks after', () => {
  assert.deepEqual(newlyEarned(['signin', 'fest'], null), []);
  assert.deepEqual(newlyEarned(['signin', 'fest'], []), ['signin', 'fest']);
  assert.deepEqual(newlyEarned(['signin', 'fest'], ['signin']), ['fest']);
  assert.deepEqual(newlyEarned([], ['signin']), []);
});

test('the record is per user and survives a junk entry', () => {
  const store = storage();
  assert.equal(readSeen(SESSION, store), null);
  writeSeen(SESSION, ['signin'], store);
  assert.deepEqual(readSeen(SESSION, store), ['signin']);
  assert.equal(readSeen(OTHER, store), null);
  writeSeen(OTHER, ['fest'], store);
  assert.deepEqual(readSeen(SESSION, store), ['signin']);
  assert.deepEqual(readSeen(OTHER, store), ['fest']);

  const junk = storage({ [SEEN_STICKERS_KEY]: '{not json' });
  assert.equal(readSeen(SESSION, junk), null);
  writeSeen(SESSION, ['signin'], junk);
  assert.deepEqual(readSeen(SESSION, junk), ['signin']);
});

test('writeSeen only ever adds', () => {
  const store = storage();
  writeSeen(SESSION, ['signin', 'fest'], store);
  writeSeen(SESSION, ['signin'], store);
  assert.deepEqual(readSeen(SESSION, store), ['signin', 'fest']);
});

test('no storage or no user: reads null, writes nothing, never throws', () => {
  assert.equal(readSeen(SESSION, null), null);
  assert.doesNotThrow(() => writeSeen(SESSION, ['signin'], null));
  const store = storage();
  assert.equal(readSeen({ user: {} }, store), null);
  writeSeen(null, ['signin'], store);
  assert.deepEqual(store.dump(), {});
});

test('noteEarned: the DigitalOcean case, seen once and then not again', () => {
  const store = storage();
  /* First look seeds the record: the sign-in sticker is simply there. */
  assert.deepEqual(noteEarned(SESSION, ['signin'], store), []);
  /* Back from DigitalOcean with the sticker granted: that one is new. */
  assert.deepEqual(noteEarned(SESSION, ['signin', 'digitalocean'], store), [
    'digitalocean',
  ]);
  /* A reload says nothing. */
  assert.deepEqual(noteEarned(SESSION, ['signin', 'digitalocean'], store), []);
});

test('openingTab turns to the page of a sticker earned just now', () => {
  const stickers = [
    { id: 'signin', type: 'required', completed: true },
    { id: 'address', type: 'required', completed: false },
    { id: 'fest', type: 'inperson', completed: true },
    { id: 'digitalocean', type: 'tools', completed: true },
  ];
  assert.equal(openingTab(stickers, new Set(['digitalocean'])), 'tools');
  assert.equal(openingTab(stickers, ['fest', 'digitalocean']), 'inperson');
  /* Nothing new: the default page, the one holding the next sticker. */
  assert.equal(openingTab(stickers, new Set()), 'required');
  assert.equal(openingTab(stickers, null), 'required');
});
