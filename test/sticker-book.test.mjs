import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { ACTIVITIES, REQUIRED_STICKERS } from '../src/data/eligibility.mjs';
import { TYPE_ORDER } from '../src/lib/activityFilters.mjs';
import {
  REQUIRED_TAB,
  bookCounts,
  bookStickers,
  PAGE_ROWS,
  bookTabs,
  defaultTab,
  filterBook,
  milestoneState,
  rewardsState,
  rowsBelow,
} from '../src/lib/stickerBook.mjs';

/* The sticker book's pure half: the two required stickers ahead of the
   catalogue, one tab per type present, and the page the book opens on. */

const experience = (over = {}) => ({
  addressValidated: false,
  activities: [],
  thresholds: { stickers: 1, complete: 3 },
  ...over,
});

test('the book is the two required stickers, then the catalogue in order', () => {
  const book = bookStickers(experience());
  assert.deepEqual(
    book.map((sticker) => sticker.id),
    REQUIRED_STICKERS.map((s) => s.id).concat(ACTIVITIES.map((a) => a.id)),
  );
  assert.ok(book.every((sticker) => sticker.type));
  assert.ok(book.every((sticker) => sticker.art));
});

test('signing in is earned on arrival; the address is earned once validated', () => {
  const before = bookStickers(experience());
  assert.equal(before.find((s) => s.id === 'signin').completed, true);
  assert.equal(before.find((s) => s.id === 'address').completed, false);

  const after = bookStickers(experience({ addressValidated: true }));
  assert.equal(after.find((s) => s.id === 'address').completed, true);
});

test('the address sticker links where it is told to, and changes its ask once done', () => {
  const href = 'https://example.test/addresses';
  const todo = bookStickers(experience(), { addressHref: href }).find(
    (s) => s.id === 'address',
  );
  assert.equal(todo.href, href);
  assert.equal(todo.ctaLabel, REQUIRED_STICKERS[1].ctaLabel);

  const done = bookStickers(experience({ addressValidated: true }), {
    addressHref: href,
  }).find((s) => s.id === 'address');
  assert.equal(done.href, href);
  assert.equal(done.ctaLabel, REQUIRED_STICKERS[1].doneCtaLabel);

  /* No destination given: no CTA, never a dead link. */
  assert.equal(bookStickers(experience())[1].href, null);
});

test('activity completion and its source ride through from the experience', () => {
  const book = bookStickers(
    experience({
      activities: [
        {
          id: 'fest',
          completed: true,
          completedAt: '2026-10-11',
          source: 'event_checkins',
        },
      ],
    }),
  );
  const fest = book.find((s) => s.id === 'fest');
  assert.equal(fest.completed, true);
  assert.equal(fest.completedAt, '2026-10-11');
  assert.equal(fest.source, 'event_checkins');
  assert.equal(book.find((s) => s.id === 'ghw').completed, false);
  assert.equal(book.find((s) => s.id === 'ghw').source, null);
});

test('required stickers say where they came from', () => {
  const book = bookStickers(experience({ addressValidated: true }));
  assert.equal(book[0].source, 'mlh');
  assert.equal(book[1].source, 'mlh');
});

test('tabs: Required first, then one per type present, in the fixed order, with counts', () => {
  const book = bookStickers(
    experience({
      addressValidated: true,
      activities: [{ id: 'livestreams-1', completed: true }],
    }),
  );
  const tabs = bookTabs(book);
  assert.equal(tabs[0].key, 'required');
  assert.equal(tabs[0].count, 2);
  assert.equal(tabs[0].earned, 2);
  assert.deepEqual(
    tabs.slice(1).map((tab) => tab.key),
    TYPE_ORDER.filter((type) => ACTIVITIES.some((a) => a.type === type)),
  );
  const livestreams = tabs.find((tab) => tab.key === 'livestreams');
  assert.equal(
    livestreams.count,
    ACTIVITIES.filter((a) => a.type === 'livestreams').length,
  );
  assert.equal(livestreams.earned, 1);
  /* A type with nothing in the book has no tab: take the Tools stickers
     away and the Tools tab goes with them. */
  const withoutTools = book.filter((s) => s.type !== 'tools');
  assert.ok(!bookTabs(withoutTools).some((tab) => tab.key === 'tools'));
});

test('a tab shows its own stickers, in book order, and never reorders', () => {
  const book = bookStickers(experience());
  assert.deepEqual(
    filterBook(book, 'required').map((s) => s.id),
    ['signin', 'address'],
  );
  assert.deepEqual(
    filterBook(book, 'ghw').map((s) => s.id),
    ACTIVITIES.filter((a) => a.type === 'ghw').map((a) => a.id),
  );
  assert.deepEqual(filterBook(book, 'nope'), []);
});

test('the book opens on the page holding the next sticker', () => {
  /* An activity page, never the Required one, while there is one to earn. */
  assert.equal(defaultTab(bookStickers(experience())), ACTIVITIES[0].type);
  assert.equal(
    defaultTab(bookStickers(experience({ addressValidated: true }))),
    ACTIVITIES[0].type,
  );
  /* The first activity's whole type earned: the next unearned activity's
     type, in catalogue order. */
  const firstType = ACTIVITIES[0].type;
  const firstTypeDone = ACTIVITIES.filter((a) => a.type === firstType).map(
    (a) => ({ id: a.id, completed: true }),
  );
  assert.equal(
    defaultTab(
      bookStickers(
        experience({ addressValidated: true, activities: firstTypeDone }),
      ),
    ),
    ACTIVITIES.find((a) => a.type !== firstType).type,
  );
  /* Everything earned: back to the first page. */
  const everything = ACTIVITIES.map((a) => ({ id: a.id, completed: true }));
  assert.equal(
    defaultTab(
      bookStickers(
        experience({ addressValidated: true, activities: everything }),
      ),
    ),
    REQUIRED_TAB,
  );
});

test('milestoneState: the level, the gated count, the threshold', () => {
  assert.deepEqual(milestoneState(experience()), {
    level: 0,
    done: 0,
    complete: 3,
    completionist: 13,
    completionistPlusPlus: 18,
    addressValidated: false,
  });
  /* No address: activities do not count, the same gate progressLevel has. */
  assert.equal(
    milestoneState(
      experience({ activities: [{ id: 'fest', completed: true }] }),
    ).done,
    0,
  );
  const one = milestoneState(
    experience({
      addressValidated: true,
      activities: [{ id: 'fest', completed: true }],
    }),
  );
  assert.equal(one.level, 1);
  assert.equal(one.done, 1);
});

test('rewardsState: the pack as three needs, completion as a meter of five', () => {
  const fresh = rewardsState(experience(), bookStickers(experience()));
  assert.equal(fresh.pack.earned, false);
  assert.deepEqual(fresh.pack.needs, {
    signedIn: true,
    address: false,
    activity: false,
  });
  assert.equal(fresh.pack.count, 1);
  assert.equal(fresh.completion.target, 5);
  assert.deepEqual(
    fresh.completion.pips.map((s) => s.id),
    ['signin'],
  );
  /* Book units: five to reach, one (the sign-in) in. */
  assert.equal(fresh.completion.remaining, 4);
  assert.equal(fresh.earnedRewards, 0);

  /* A Fest with no address: the sticker is in the book (a pip, and the
     ungated count), the pack is not earned. */
  const noAddress = experience({
    activities: [{ id: 'fest', completed: true }],
  });
  const gated = rewardsState(noAddress, bookStickers(noAddress));
  assert.equal(gated.activityStickers, 1);
  assert.equal(gated.pack.earned, false);
  assert.deepEqual(
    gated.completion.pips.map((s) => s.id),
    ['signin', 'fest'],
  );

  const done = experience({
    addressValidated: true,
    activities: ACTIVITIES.slice(0, 3).map((a) => ({
      id: a.id,
      completed: true,
    })),
  });
  const complete = rewardsState(done, bookStickers(done));
  assert.equal(complete.pack.earned, true);
  assert.equal(complete.completion.earned, true);
  assert.equal(complete.completion.pips.length, 5);
  assert.equal(complete.completion.remaining, 0);
  assert.equal(complete.earnedRewards, 2);
  /* The third card shows once the first two are earned, and not before. */
  assert.equal(fresh.completionist.shown, false);
  assert.equal(complete.completionist.shown, true);
  assert.equal(complete.completionist.earned, false);
  assert.equal(complete.completionist.target, 13 + 2);
  assert.equal(complete.completionist.remaining, 13 - 3);
  assert.equal(complete.completionist.pips.length, 5);
});

test('rewardsState: thirteen activity stickers and the required two, fifteen in the book, make a Completionist', () => {
  const all = experience({
    addressValidated: true,
    activities: ACTIVITIES.slice(0, 13).map((a) => ({
      id: a.id,
      completed: true,
    })),
  });
  const state = rewardsState(all, bookStickers(all));
  assert.equal(state.level, 3);
  assert.equal(state.completionist.earned, true);
  assert.equal(state.completionist.remaining, 0);
  assert.equal(state.completionist.pips.length, 15);
  assert.equal(state.earnedRewards, 3);
});

/* Completionist++, Milestone 4: /my's alone, and only for someone who is
   already a Completionist, so the card does not exist at levels 0 to 2.
   Its meter is twenty pips, the threshold of eighteen plus the required
   two, filled in book order like the others. */
test('rewardsState: Completionist++ is shown only from Completionist on, as a meter of twenty', () => {
  const at = (count) => {
    const over = experience({
      addressValidated: true,
      activities: ACTIVITIES.slice(0, count).map((a) => ({
        id: a.id,
        completed: true,
      })),
    });
    return rewardsState(over, bookStickers(over));
  };
  for (const [count, level] of [
    [0, 0],
    [1, 1],
    [12, 2],
  ]) {
    const state = at(count);
    assert.equal(state.level, level);
    assert.equal(state.completionistPlusPlus.shown, false, `level ${level}`);
    assert.equal(state.completionistPlusPlus.earned, false, `level ${level}`);
  }

  /* Fourteen activity stickers and the required two: a Completionist,
     sixteen of twenty toward the fourth. */
  const pending = at(14);
  assert.equal(pending.level, 3);
  assert.equal(pending.completionist.earned, true);
  assert.equal(pending.completionistPlusPlus.shown, true);
  assert.equal(pending.completionistPlusPlus.earned, false);
  assert.equal(pending.completionistPlusPlus.earnedAt, null);
  assert.equal(pending.completionistPlusPlus.target, 18 + 2);
  assert.equal(pending.completionistPlusPlus.pips.length, 16);
  assert.equal(pending.completionistPlusPlus.remaining, 4);
  assert.equal(pending.earnedRewards, 3);

  /* Eighteen and the required two: twenty in the book, earned. */
  const earned = at(18);
  assert.equal(earned.level, 4);
  assert.equal(earned.completionistPlusPlus.shown, true);
  assert.equal(earned.completionistPlusPlus.earned, true);
  assert.equal(earned.completionistPlusPlus.pips.length, 20);
  assert.equal(earned.completionistPlusPlus.remaining, 0);
  assert.equal(earned.earnedRewards, 4);
});

/* The day the book's twentieth sticker landed, by the stickers' own dates
   rather than book order: here the activities are dated backwards, so
   the twentieth date is the first activity's, and a nineteenth activity
   earned later does not move it. */
test('rewardsState: Completionist++ is dated by the twentieth sticker to land', () => {
  const ids = ACTIVITIES.slice(0, 19).map((a) => a.id);
  const dated = experience({
    addressValidated: true,
    required: [
      { id: 'signin', completed: true, completedAt: '2026-10-01' },
      { id: 'address', completed: true, completedAt: '2026-10-01' },
    ],
    activities: ids.map((id, index) => ({
      id,
      completed: true,
      completedAt:
        index === 18
          ? '2026-10-25'
          : `2026-10-${String(19 - index).padStart(2, '0')}`,
    })),
  });
  const state = rewardsState(dated, bookStickers(dated));
  assert.equal(state.level, 4);
  assert.equal(state.completionistPlusPlus.earnedAt, '2026-10-19');
  /* Fifteen dates in: the Completionist day, unchanged by the fourth. */
  assert.equal(state.completionist.earnedAt, '2026-10-14');
});

/* The fourth card's words. Pending, its line names the gap between the
   Completionist and Completionist++ thresholds (five today) in a lower-case
   word, the way components/RewardsBand reads it off the two targets, so
   the sentence stays true if either threshold moves. */
test('Completionist++ copy: the gap between the thresholds in words, and a hero line for level 4', () => {
  const words = my.rewards.completionistPlusPlus;
  const over = experience({
    addressValidated: true,
    activities: ACTIVITIES.slice(0, 14).map((a) => ({
      id: a.id,
      completed: true,
    })),
  });
  const state = rewardsState(over, bookStickers(over));
  const more = state.completionistPlusPlus.target - state.completionist.target;
  assert.equal(more, 5);
  assert.equal(
    words.why.pending(more),
    'You completed Hacktoberfest, but do you want to go one step further? Earn five additional stickers to earn Completionist++ bragging rights!',
  );
  assert.equal(words.tag, 'Milestone 4');
  assert.equal(words.title, 'Become a Completionist++');
  assert.equal(words.reachedBadge, 'Earned');
  assert.equal(
    words.pendingBadge(
      state.completionistPlusPlus.pips.length,
      state.completionistPlusPlus.target,
    ),
    '16 of 20',
  );
  assert.equal(
    words.meterLabel(16, 20),
    '16 of 20 stickers toward Completionist++',
  );
  assert.equal(
    words.why.earned,
    'You’re a Hacktoberfest 2026 Completionist++. Twenty stickers in the book, and the bragging rights are all yours.',
  );
  assert.equal(
    words.shareText,
    'I’m a Hacktoberfest 2026 Completionist++! Twenty stickers in the book. #Hacktoberfest https://hacktoberfest.com',
  );
  assert.equal(
    my.rewards.intro.completionistPlusPlus,
    'You’re a Hacktoberfest 2026 Completionist++. Twenty stickers in the book, the holographic sticker yours, and the pack in the mail.',
  );
});

test('rewardsState: each milestone carries the day it was reached, from the stickers’ own dates', () => {
  const ids = ACTIVITIES.slice(0, 3).map((a) => a.id);
  const dated = experience({
    addressValidated: true,
    required: [
      { id: 'signin', completed: true, completedAt: '2026-10-01' },
      { id: 'address', completed: true, completedAt: '2026-10-03' },
    ],
    activities: [
      { id: ids[0], completed: true, completedAt: '2026-10-02' },
      { id: ids[1], completed: true, completedAt: '2026-10-09' },
      { id: ids[2], completed: true, completedAt: '2026-10-06' },
    ],
  });
  const state = rewardsState(dated, bookStickers(dated));
  /* The pack: the day its last requirement landed, the address here. */
  assert.equal(state.pack.earnedAt, '2026-10-03');
  /* The holographic sticker: the day the book reached five. */
  assert.equal(state.completion.earnedAt, '2026-10-09');
  assert.equal(state.completionist.earnedAt, null);

  /* No dates on record: earned, but with no day to say. */
  const undated = experience({
    addressValidated: true,
    activities: ids.map((id) => ({ id, completed: true })),
  });
  const bare = rewardsState(undated, bookStickers(undated));
  assert.equal(bare.pack.earned, true);
  assert.equal(bare.pack.earnedAt, null);
  assert.equal(bare.completion.earnedAt, null);
});

test('a DEV challenge is locked until the DEV account is linked; the connect sticker never is', () => {
  const unlinked = bookStickers(experience({ user: { devLinked: false } }));
  const week = unlinked.find((s) => s.id === 'dev-week-1');
  const connect = unlinked.find((s) => s.id === 'dev-connect');
  const other = unlinked.find((s) => s.id === 'discord');
  assert.equal(week.locked, true);
  assert.equal(connect.locked, false);
  assert.equal(other.locked, false);
  const linked = bookStickers(experience({ user: { devLinked: true } }));
  assert.equal(linked.find((s) => s.id === 'dev-week-1').locked, false);
});

test('counts are the whole book, required stickers included', () => {
  assert.deepEqual(bookCounts(bookStickers(experience())), {
    earned: 1,
    total: 2 + ACTIVITIES.length,
  });
  assert.deepEqual(
    bookCounts(
      bookStickers(
        experience({
          addressValidated: true,
          activities: [{ id: 'fest', completed: true }],
        }),
      ),
    ),
    { earned: 3, total: 2 + ACTIVITIES.length },
  );
});

test('nothing to read is an unearned book, never a crash', () => {
  assert.equal(bookStickers(null).length, 2 + ACTIVITIES.length);
  assert.equal(bookStickers(undefined)[0].completed, true);
  assert.equal(bookStickers(undefined)[1].completed, false);
});

test('a recorded required completion supplies when it was earned', () => {
  const book = bookStickers(
    experience({
      addressValidated: true,
      required: [
        {
          id: 'signin',
          completed: true,
          completedAt: '2026-09-20T09:00:00.000Z',
          source: 'api',
        },
        {
          id: 'address',
          completed: true,
          completedAt: '2026-09-21T09:00:00.000Z',
          source: 'api',
        },
      ],
    }),
  );
  const signin = book.find((s) => s.id === 'signin');
  const address = book.find((s) => s.id === 'address');
  assert.equal(signin.completed, true);
  assert.equal(signin.completedAt, '2026-09-20T09:00:00.000Z');
  assert.equal(address.completed, true);
  assert.equal(address.completedAt, '2026-09-21T09:00:00.000Z');
});

test('the address sticker is earned by the live flag even before the row lands', () => {
  const book = bookStickers(
    experience({
      addressValidated: true,
      required: [
        { id: 'address', completed: false, completedAt: null, source: null },
      ],
    }),
  );
  const address = book.find((s) => s.id === 'address');
  assert.equal(address.completed, true);
  assert.equal(address.completedAt, null);
  assert.equal(address.ctaLabel, 'Update address');
});

test('a latched address completion stays earned when the live flag is off', () => {
  const book = bookStickers(
    experience({
      addressValidated: false,
      required: [
        {
          id: 'address',
          completed: true,
          completedAt: '2026-09-21T09:00:00.000Z',
          source: 'api',
        },
      ],
    }),
  );
  assert.equal(book.find((s) => s.id === 'address').completed, true);
});

test('signing in is never unearned, whatever the payload says', () => {
  const book = bookStickers(
    experience({
      required: [
        { id: 'signin', completed: false, completedAt: null, source: null },
      ],
    }),
  );
  assert.equal(book.find((s) => s.id === 'signin').completed, true);
});

test("a required sticker's source is the MyMLH word, or manual when granted by hand", () => {
  const book = bookStickers(
    experience({
      addressValidated: true,
      required: [
        {
          id: 'signin',
          completed: true,
          completedAt: '2026-09-20T09:00:00.000Z',
          source: 'api',
        },
        {
          id: 'address',
          completed: true,
          completedAt: '2026-09-21T09:00:00.000Z',
          source: 'manual',
        },
      ],
    }),
  );
  assert.equal(book.find((s) => s.id === 'signin').source, 'mlh');
  assert.equal(book.find((s) => s.id === 'address').source, 'manual');
});

test('an experience with no required list behaves as before', () => {
  const book = bookStickers(experience({ addressValidated: true }));
  assert.equal(book.find((s) => s.id === 'signin').completed, true);
  assert.equal(book.find((s) => s.id === 'address').completed, true);
  assert.equal(book.find((s) => s.id === 'address').source, 'mlh');
});

/* A page shows two rows of stickers and scrolls the rest inside the book
   (components/Album/PageSheet). rowsBelow is how many rows sit under the
   two, which decides whether the page scrolls and what its cue says. */
test('a page shows two rows before it scrolls', () => {
  assert.equal(PAGE_ROWS, 2);
});

test('rows below the two: none until a third row starts, then one per row', () => {
  assert.equal(rowsBelow(0, 3), 0);
  assert.equal(rowsBelow(5, 3), 0);
  assert.equal(rowsBelow(6, 3), 0);
  assert.equal(rowsBelow(7, 3), 1);
  assert.equal(rowsBelow(9, 3), 1);
  assert.equal(rowsBelow(10, 3), 2);
});

test('rows below count the columns the page has: two across on a phone', () => {
  assert.equal(rowsBelow(4, 2), 0);
  assert.equal(rowsBelow(5, 2), 1);
  assert.equal(rowsBelow(7, 2), 2);
});

test('rows below are none when the columns are not known yet', () => {
  assert.equal(rowsBelow(7, 0), 0);
  assert.equal(rowsBelow(7, Number.NaN), 0);
  assert.equal(rowsBelow(7, undefined), 0);
});

test('the cue under a scrolling page names the rows still below', () => {
  assert.equal(my.album.moreRows(1), '1 more row');
  assert.equal(my.album.moreRows(2), '2 more rows');
});
