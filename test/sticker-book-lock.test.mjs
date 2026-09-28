import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { SCENARIOS } from '../src/data/fixtures.mjs';
import { STICKER_BOOK_LOCKED } from '../src/data/stickerBookLock.mjs';
import { bookStickers, rewardsState } from '../src/lib/stickerBook.mjs';

/* The sticker book lock (data/stickerBookLock.mjs): a switch flipped by a
   deploy, never by the clock, and the words /my says while it is on. */

test('the lock is a plain switch, not a date', () => {
  assert.equal(typeof STICKER_BOOK_LOCKED, 'boolean');
});

/* Every line the locked bands can show, the numbers filled in. */
const lines = () => [
  my.locked.status.noAddress,
  my.locked.status.ready,
  my.locked.badge,
  my.locked.album.title,
  my.locked.album.copy,
  my.locked.rewards.title,
  my.locked.rewards.copy(3, 10),
  my.locked.inventory.title,
  my.locked.inventory.copy,
];

test('the locked copy is all there, and in the house style', () => {
  for (const line of lines()) {
    assert.equal(typeof line, 'string');
    assert.ok(line.trim().length > 0, 'a locked line is empty');
    assert.doesNotMatch(line, /—/, `em dash in "${line}"`);
    assert.doesNotMatch(line, /organizer/i, `"hosts", not "${line}"`);
  }
});

/* The date is the one fact every panel and the hero share: said the same
   way everywhere, so a change of date is a search for one string. */
test('the hero, the badge and every panel say when: October 1st', () => {
  for (const line of [
    my.locked.status.noAddress,
    my.locked.status.ready,
    my.locked.badge,
    my.locked.album.title,
    my.locked.rewards.title,
    my.locked.inventory.title,
  ]) {
    assert.match(line, /October 1st/, `"${line}" does not say October 1st`);
  }
});

/* The address is asked for only while MLH has none: once it is in, the
   hero stops asking. */
test('the hero asks for the address only while it is missing', () => {
  assert.match(my.locked.status.noAddress, /address/);
  assert.doesNotMatch(my.locked.status.ready, /address/);
});

/* The milestones panel says the rewards band's own numbers, from
   rewardsState, so the two never disagree once the book opens: the three
   stickers the pack asks for, and the book's target for the holographic
   sticker (the API's `complete` threshold plus the two required). */
test('the milestones panel counts from the rewards band', () => {
  const experience = SCENARIOS['nothing-done'];
  const rewards = rewardsState(
    experience,
    bookStickers(experience, { addressHref: 'https://my.mlh.io/' }),
  );
  assert.equal(
    my.locked.rewards.copy(rewards.pack.total, rewards.completion.target),
    'Three stickers put a sticker pack in the mail. Ten unlock the holographic sticker.',
  );
});
