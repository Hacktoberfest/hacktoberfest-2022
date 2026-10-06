import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { ACTIVITIES } from '../src/data/eligibility.mjs';
import {
  REQUIRED_TAB,
  bookCounts,
  bookStickers,
  bookTabs,
  defaultTab,
  filterBook,
  firstActivitySticker,
  isRequiredSticker,
  milestoneState,
  placeSecrets,
  rewardsState,
} from '../src/lib/stickerBook.mjs';

/* Secret stickers in the book, generically. The earned one is invented,
   its art a plain hexagon in the site's own sticker shape, and the
   revealers are catalogue stickers picked for no reason but that they
   exist (ghw, discord). Nothing here is a real secret. */
const ART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M100 0 L186.6 50 L186.6 150 L100 200 L13.4 150 L13.4 50 Z" fill="#1f4e6b"/></svg>';

const placeholder = (over = {}) => ({
  id: 'secret-1',
  secret: true,
  hint: 'A demo hint',
  revealedBy: 'ghw',
  required: false,
  completed: false,
  completedAt: null,
  source: null,
  ...over,
});

const earned = (over = {}) => ({
  id: 'demo-secret',
  secret: true,
  name: 'A demo secret',
  description: 'Invented for the test.',
  art: ART,
  revealedBy: 'ghw',
  required: false,
  completed: true,
  completedAt: '2026-10-14T12:00:00.000Z',
  source: 'manual',
  ...over,
});

const experience = (over = {}) => ({
  addressValidated: true,
  activities: [],
  thresholds: { stickers: 1, complete: 3 },
  ...over,
});

const ids = (stickers) => stickers.map((sticker) => sticker.id);

test('a secret sits at the end of its revealer’s page', () => {
  const book = bookStickers(experience({ secrets: [placeholder()] }));
  const plain = bookStickers(experience());
  const page = filterBook(book, 'ghw');
  assert.equal(page.at(-1).id, 'secret-1');
  assert.equal(page.at(-1).type, 'ghw');
  /* The revealer opens a page with several stickers after it, and the
     secret still comes after every one of them, not straight after the
     revealer. */
  const plainPage = ids(filterBook(plain, 'ghw'));
  assert.equal(plainPage[0], 'ghw');
  assert.ok(plainPage.length > 2);
  assert.deepEqual(ids(page), [...plainPage, 'secret-1']);
  /* Everything else stays where it was. */
  assert.deepEqual(
    ids(book.filter((sticker) => !sticker.secret)),
    ids(bookStickers(experience())),
  );
});

test('secrets that share a revealer keep the payload’s order', () => {
  const book = bookStickers(
    experience({
      secrets: [earned(), placeholder(), placeholder({ id: 'secret-2' })],
    }),
  );
  const plainPage = ids(filterBook(bookStickers(experience()), 'ghw'));
  assert.deepEqual(ids(filterBook(book, 'ghw')), [
    ...plainPage,
    'demo-secret',
    'secret-1',
    'secret-2',
  ]);
});

test('secrets revealed from different stickers on one page all end it, in the payload’s order', () => {
  /* The Required page: the payload names the address's secret first, so
     it comes first, though the sign-in sticker is the earlier revealer. */
  const book = bookStickers(
    experience({
      secrets: [
        placeholder({ revealedBy: 'address' }),
        placeholder({ id: 'secret-2', revealedBy: 'signin' }),
      ],
    }),
  );
  assert.deepEqual(ids(filterBook(book, REQUIRED_TAB)), [
    'signin',
    'address',
    'secret-1',
    'secret-2',
  ]);
  /* A secret's page is its revealer's, so a regular sticker added to the
     catalogue's page never lands after one. */
  assert.deepEqual(
    ids(book.filter((sticker) => !sticker.secret)),
    ids(bookStickers(experience())),
  );
});

test('each secret takes its own revealer’s page', () => {
  const book = bookStickers(
    experience({
      secrets: [
        placeholder({ revealedBy: 'discord' }),
        placeholder({ id: 'secret-2' }),
      ],
    }),
  );
  const tools = filterBook(book, 'tools');
  assert.equal(tools.at(-1).id, 'secret-1');
  assert.equal(tools.at(-1).type, 'tools');
  assert.ok(
    tools.findIndex((sticker) => sticker.id === 'discord') < tools.length - 2,
  );
  assert.equal(filterBook(book, 'ghw').at(-1).id, 'secret-2');
});

test('a secret with no revealer in the book goes at the end of the last page', () => {
  const book = bookStickers(
    experience({
      secrets: [
        placeholder({ revealedBy: 'not-in-the-book' }),
        placeholder({ id: 'secret-2', revealedBy: null }),
      ],
    }),
  );
  const last = bookTabs(book).at(-1).key;
  assert.deepEqual(ids(filterBook(book, last)).slice(-2), [
    'secret-1',
    'secret-2',
  ]);
  assert.deepEqual(ids(book).slice(-2), ['secret-1', 'secret-2']);
});

test('a placeholder is the secret title, the hint, and nothing to do', () => {
  assert.equal(my.album.cell.secretTitle, 'Secret sticker');
  const sticker = bookStickers(experience({ secrets: [placeholder()] })).find(
    (entry) => entry.secret,
  );
  assert.equal(sticker.placeholder, true);
  assert.equal(sticker.completed, false);
  assert.equal(sticker.label, 'Secret sticker');
  assert.equal(sticker.hint, 'A demo hint');
  assert.equal(sticker.art, null);
  assert.equal(sticker.detail, null);
  assert.equal(sticker.href, null);
  assert.equal(sticker.locked, false);
  const bare = bookStickers(
    experience({ secrets: [placeholder({ hint: null })] }),
  ).find((entry) => entry.secret);
  assert.equal(bare.hint, null);
});

test('an earned secret wears the API’s name, words, art and date', () => {
  const sticker = bookStickers(experience({ secrets: [earned()] })).find(
    (entry) => entry.secret,
  );
  assert.equal(sticker.placeholder, false);
  assert.equal(sticker.completed, true);
  assert.equal(sticker.label, 'A demo secret');
  assert.equal(sticker.detail, 'Invented for the test.');
  assert.equal(sticker.art, ART);
  assert.equal(sticker.completedAt, '2026-10-14T12:00:00.000Z');
  assert.equal(sticker.source, 'manual');
  assert.equal(sticker.hint, null);
});

test('art that fails is dropped; the sticker keeps its place and its count', () => {
  const book = bookStickers(
    experience({ secrets: [earned({ art: '<img src="x">' })] }),
  );
  const kept = filterBook(book, 'ghw').at(-1);
  assert.equal(kept.id, 'demo-secret');
  assert.equal(kept.art, null);
  assert.equal(kept.completed, true);
  assert.equal(
    bookCounts(book).earned,
    bookCounts(bookStickers(experience())).earned + 1,
  );
});

test('the book counts every secret it holds, the earned ones as earned', () => {
  const plain = bookStickers(experience());
  const book = bookStickers(experience({ secrets: [earned(), placeholder()] }));
  assert.deepEqual(bookCounts(book), {
    earned: bookCounts(plain).earned + 1,
    total: bookCounts(plain).total + 2,
  });
  const ghw = bookTabs(book).find((tab) => tab.key === 'ghw');
  assert.equal(
    ghw.count,
    ACTIVITIES.filter((a) => a.type === 'ghw').length + 2,
  );
  assert.equal(ghw.earned, 1);
});

test('placeSecrets places among any list and leaves the one given alone', () => {
  const list = [
    { id: 'ghw', type: 'ghw' },
    { id: 'discord', type: 'tools' },
  ];
  const placed = placeSecrets(list, [earned()]);
  assert.deepEqual(ids(placed), ['ghw', 'discord', 'demo-secret']);
  assert.equal(placed.at(-1).type, 'ghw');
  assert.equal(list.length, 2);
  assert.deepEqual(placeSecrets(list, null), list);
  assert.equal(placeSecrets(null, [placeholder()]).length, 1);
});

test('placeSecrets ends each page after every regular sticker, whichever one revealed it', () => {
  const list = [
    { id: 'ghw', type: 'ghw' },
    { id: 'ghw-b', type: 'ghw' },
    { id: 'ghw-c', type: 'ghw' },
    { id: 'discord', type: 'tools' },
  ];
  const placed = placeSecrets(list, [
    placeholder({ id: 'secret-1', revealedBy: 'ghw-b' }),
    placeholder({ id: 'secret-2', revealedBy: 'ghw' }),
    placeholder({ id: 'secret-3', revealedBy: 'discord' }),
  ]);
  const page = (type) => ids(placed.filter((sticker) => sticker.type === type));
  assert.deepEqual(page('ghw'), [
    'ghw',
    'ghw-b',
    'ghw-c',
    'secret-1',
    'secret-2',
  ]);
  assert.deepEqual(page('tools'), ['discord', 'secret-3']);
});

test('a placeholder never decides the page the book opens on', () => {
  const everything = ACTIVITIES.map((a) => ({ id: a.id, completed: true }));
  /* A finished book with a placeholder in it opens as a finished book. */
  assert.equal(
    defaultTab(
      bookStickers(
        experience({ activities: everything, secrets: [placeholder()] }),
      ),
    ),
    REQUIRED_TAB,
  );
  /* With an activity still to do, on that activity's page, whatever the
     placeholder is: it comes last in book order and never decides. */
  const allButDiscord = everything.filter((a) => a.id !== 'discord');
  assert.equal(
    defaultTab(
      bookStickers(
        experience({ activities: allButDiscord, secrets: [placeholder()] }),
      ),
    ),
    'tools',
  );
});

const DATED_REQUIRED = [
  { id: 'signin', completed: true, completedAt: '2026-10-01' },
  { id: 'address', completed: true, completedAt: '2026-10-02' },
];

test('milestoneState counts an earned secret, never a placeholder, behind the address gate', () => {
  const activities = [{ id: 'fest', completed: true }];
  const secrets = [earned(), placeholder()];
  const state = milestoneState(experience({ activities, secrets }));
  assert.equal(state.done, 2);
  assert.equal(state.level, 1);
  const reached = milestoneState(
    experience({
      activities: [...activities, { id: 'ghw', completed: true }],
      secrets,
    }),
  );
  assert.equal(reached.done, 3);
  assert.equal(reached.level, 2);
  assert.equal(
    milestoneState(experience({ addressValidated: false, activities, secrets }))
      .done,
    0,
  );
});

test('rewardsState fills the meters and their dates with earned secrets, in book order', () => {
  const dated = experience({
    thresholds: { stickers: 1, complete: 2 },
    required: DATED_REQUIRED,
    activities: [{ id: 'ghw', completed: true, completedAt: '2026-10-03' }],
    secrets: [earned({ completedAt: '2026-10-04' }), placeholder()],
  });
  const state = rewardsState(dated, bookStickers(dated));
  assert.deepEqual(
    state.completion.pips.map((sticker) => sticker.id),
    ['signin', 'address', 'ghw', 'demo-secret'],
  );
  assert.equal(state.activityStickers, 2);
  assert.equal(state.level, 2);
  assert.equal(state.completion.earned, true);
  /* The book reached four on the day the secret was earned. */
  assert.equal(state.completion.earnedAt, '2026-10-04');
});

test('a secret on the Required page is an activity sticker, never one of the two', () => {
  assert.equal(isRequiredSticker({ id: 'signin', type: REQUIRED_TAB }), true);
  assert.equal(
    isRequiredSticker({ id: 'demo-secret', type: REQUIRED_TAB, secret: true }),
    false,
  );
  assert.equal(isRequiredSticker(null), false);

  const revealedBySigningIn = experience({
    required: DATED_REQUIRED,
    secrets: [
      earned({ revealedBy: 'signin', completedAt: '2026-10-05' }),
      placeholder({ revealedBy: 'address' }),
    ],
  });
  const book = bookStickers(revealedBySigningIn);
  assert.equal(
    book.find((sticker) => sticker.id === 'demo-secret').type,
    REQUIRED_TAB,
  );
  const state = rewardsState(revealedBySigningIn, book);
  assert.equal(state.activityStickers, 1);
  assert.deepEqual(state.pack.needs, {
    signedIn: true,
    address: true,
    activity: true,
  });
  assert.equal(state.pack.earned, true);
  /* The pack's day is its last requirement's: the secret, the first
     activity sticker, not the placeholder's missing date. */
  assert.equal(state.pack.earnedAt, '2026-10-05');
});

test('secrets on the Required page leave the pack, its date and the activity count alone', () => {
  const crowded = experience({
    required: DATED_REQUIRED,
    activities: [{ id: 'ghw', completed: true, completedAt: '2026-10-03' }],
    secrets: [
      placeholder({ revealedBy: 'signin' }),
      earned({ revealedBy: 'address', completedAt: '2026-10-09' }),
    ],
  });
  const book = bookStickers(crowded);
  assert.deepEqual(
    book
      .filter((sticker) => sticker.type === REQUIRED_TAB)
      .map((sticker) => sticker.id),
    ['signin', 'address', 'secret-1', 'demo-secret'],
  );
  const state = rewardsState(crowded, book);
  /* The earned secret is counted, as the level counts it; the
     placeholder is not. */
  assert.equal(milestoneState(crowded).done, 2);
  assert.equal(state.activityStickers, 2);
  assert.equal(state.pack.earned, true);
  /* The pack's day is the later of the two required stickers' days and
     the first activity sticker's, however late a secret was earned and
     however empty a placeholder's date is. */
  assert.equal(state.pack.earnedAt, '2026-10-03');
});

test('the cell’s words: Secret on an earned one’s corner, Not yet with no hint', () => {
  assert.equal(my.album.cell.secret, 'Secret');
  assert.equal(my.album.cell.notYet, 'Not yet');
});

test('the pack’s activity pip draws the first activity sticker, an earned secret included', () => {
  const onRequiredPage = bookStickers(
    experience({ secrets: [earned({ revealedBy: 'signin' })] }),
  );
  assert.equal(firstActivitySticker(onRequiredPage).id, 'demo-secret');
  const withFest = bookStickers(
    experience({
      activities: [{ id: 'fest', completed: true }],
      secrets: [earned()],
    }),
  );
  /* Book order decides, and a secret is last in it: the Fest, wherever
     the secret sits. */
  assert.equal(firstActivitySticker(withFest).id, 'fest');
  const festAndRequiredSecret = bookStickers(
    experience({
      activities: [{ id: 'fest', completed: true }],
      secrets: [earned({ revealedBy: 'signin' })],
    }),
  );
  assert.equal(firstActivitySticker(festAndRequiredSecret).id, 'fest');
  assert.equal(firstActivitySticker(bookStickers(experience())), null);
  assert.equal(firstActivitySticker(null), null);
});
