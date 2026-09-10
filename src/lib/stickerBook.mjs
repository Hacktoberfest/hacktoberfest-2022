/* The sticker book on /my, pure: the two required stickers ahead of the
   catalogue, one tab per type present, and the page the book opens on.
   No I/O, no React, so node --test covers it (test/sticker-book.test.mjs).

   Relative imports, matching the rest of lib/: Node resolves this file
   directly and never sees jsconfig's baseUrl alias. */
import { ACTIVITIES, REQUIRED_STICKERS } from '../data/eligibility.mjs';
import { TYPE_ORDER } from './activityFilters.mjs';
import {
  completedCount,
  mergeActivities,
  progressLevel,
  thresholdsOf,
} from './eligibility.mjs';

export const REQUIRED_TAB = 'required';

/* The book's word for where a required sticker came from; MyMLH is the
   source of both unless an admin granted one by hand. The API writes these
   rows with source 'api', whose label on this site names DevRelay, so the
   payload's word is never shown for a required sticker. */
const MLH_SOURCE = 'mlh';
const MANUAL_SOURCE = 'manual';

/* Every sticker in the book, in book order, as ActivityCard wants them:
   the catalogue's words plus `completed`, `completedAt` and `source`.

   `experience.activities` may be the API's raw entries or the merged rows
   lib/progress.mjs produced; mergeActivities handles both, and the source
   is read off the same entries since the merge drops it.

   `experience.required` is the API's required entries, `{ id, completed,
   completedAt, source }`, as lib/progress.mjs trims them. Each required
   sticker is earned when its row says so OR the live fact does: signing in
   is earned by being here, and the address by `addressValidated`, which
   covers the first load after adding one, when /api/me/fests triggers the
   grant in parallel with the progress read. A row stays earned when the
   live flag is off: completions latch, and the mailing gate (eligibility.mjs)
   reads the flag on its own. */
export const bookStickers = (experience, { addressHref = null } = {}) => {
  const addressValidated = Boolean(experience && experience.addressValidated);
  const entries = Array.isArray(experience && experience.activities)
    ? experience.activities
    : [];
  const sources = new Map(
    entries
      .filter((entry) => entry && typeof entry.id === 'string')
      .map((entry) => [
        entry.id,
        entry.completed ? (entry.source ?? null) : null,
      ]),
  );

  const recorded = new Map(
    (Array.isArray(experience && experience.required)
      ? experience.required
      : []
    )
      .filter((entry) => entry && typeof entry.id === 'string')
      .map((entry) => [entry.id, entry]),
  );

  const required = REQUIRED_STICKERS.map((sticker) => {
    const entry = recorded.get(sticker.id);
    const onRecord = Boolean(entry && entry.completed);
    const completed =
      sticker.id === 'address' ? onRecord || addressValidated : true;
    const ctaLabel =
      completed && sticker.doneCtaLabel
        ? sticker.doneCtaLabel
        : sticker.ctaLabel;
    return {
      ...sticker,
      href: sticker.id === 'address' ? addressHref : sticker.href,
      ctaLabel,
      completed,
      completedAt: onRecord ? entry.completedAt || null : null,
      source:
        onRecord && entry.source === MANUAL_SOURCE ? MANUAL_SOURCE : MLH_SOURCE,
    };
  });

  const activities = mergeActivities(entries).map((activity) => ({
    ...activity,
    source: sources.get(activity.id) ?? null,
  }));

  return required.concat(activities);
};

const ofType = (stickers, type) =>
  (Array.isArray(stickers) ? stickers : []).filter(
    (sticker) => sticker.type === type,
  );

/* Required first, then the activity types in TYPE_ORDER, each only when
   the book holds at least one sticker of it, so a type that gains entries
   gains a tab with no code change and an empty page never exists. */
export const bookTabs = (stickers) =>
  [REQUIRED_TAB].concat(TYPE_ORDER).flatMap((key) => {
    const page = ofType(stickers, key);
    if (page.length === 0) return [];
    return [
      {
        key,
        count: page.length,
        earned: page.filter((sticker) => sticker.completed).length,
      },
    ];
  });

/* One page: the tab's stickers, in book order. Nothing ever reorders. */
export const filterBook = (stickers, key) => ofType(stickers, key);

/* The page holding the first unearned sticker, in book order, so the
   address comes before any activity and the catalogue's own order decides
   between activities. A finished book opens on the first page. */
export const defaultTab = (stickers) => {
  const next = (Array.isArray(stickers) ? stickers : []).find(
    (sticker) => !sticker.completed,
  );
  return next ? next.type : REQUIRED_TAB;
};

/* The milestone numbers, with no JSX: the level (0 nothing, 1 pack earned,
   2 complete), the activity count that counts toward it (zero without an
   address, the same gate progressLevel applies), the API's completion
   threshold, and the address flag. */
export const milestoneState = (experience) => {
  const level = progressLevel(experience);
  const addressValidated = Boolean(experience && experience.addressValidated);
  const done = addressValidated
    ? completedCount(mergeActivities(experience.activities))
    : 0;
  const { complete } = thresholdsOf(experience);
  return { level, done, complete, addressValidated };
};

/* The rewards band's numbers (components/RewardsBand). `pack` is Milestone 1 as three requirements;
   `completion` is Milestone 2 as a meter of `target` pips, the completion
   threshold plus the two required stickers, filled with the earned
   stickers in book order. `activityStickers` is the activity count with no
   address gate, so the page can say "an activity sticker is in the book,
   add an address" rather than pretend nothing was earned. */
export const rewardsState = (experience, stickers) => {
  const { level, done, complete, addressValidated } =
    milestoneState(experience);
  const all = Array.isArray(stickers) ? stickers : [];
  const activityStickers = all.filter(
    (sticker) => sticker.type !== REQUIRED_TAB && sticker.completed,
  ).length;
  const target = complete + REQUIRED_STICKERS.length;
  const pips = all.filter((sticker) => sticker.completed).slice(0, target);
  return {
    level,
    complete,
    addressValidated,
    activityStickers,
    pack: {
      earned: level >= 1,
      needs: {
        signedIn: true,
        address: addressValidated,
        activity: done >= 1,
      },
      count: 1 + (addressValidated ? 1 : 0) + (done >= 1 ? 1 : 0),
      total: 3,
    },
    completion: {
      earned: level >= 2,
      pips,
      target,
      remaining: Math.max(0, complete - done),
    },
    earnedRewards: (level >= 1 ? 1 : 0) + (level >= 2 ? 1 : 0),
  };
};

export const bookCounts = (stickers) => {
  const all = Array.isArray(stickers) ? stickers : [];
  return {
    earned: all.filter((sticker) => sticker.completed).length,
    total: all.length,
  };
};

/* Kept beside the catalogue so a reader sees both halves of the book. */
export const BOOK_SIZE = REQUIRED_STICKERS.length + ACTIVITIES.length;
