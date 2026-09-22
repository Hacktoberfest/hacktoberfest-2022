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

  /* A challenge that lives on DEV is locked until the DEV account is
     linked (experience.user.devLinked): the cell wears a padlock and no
     link. The connect sticker itself never asks for the link. */
  const devLinked = Boolean(
    experience && experience.user && experience.user.devLinked,
  );
  const activities = mergeActivities(entries).map((activity) => ({
    ...activity,
    source: sources.get(activity.id) ?? null,
    locked: activity.requiresDevLink === true && !devLinked,
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
  const all = Array.isArray(stickers) ? stickers : [];
  /* An activity page first: the Required page is a form and a sticker
     everyone already has, and the pack card carries the address ask. */
  const next =
    all.find(
      (sticker) => !sticker.completed && sticker.type !== REQUIRED_TAB,
    ) || all.find((sticker) => !sticker.completed);
  return next ? next.type : REQUIRED_TAB;
};

/* Where the book opens: on the page of a sticker earned just now
   (lib/justEarned.mjs), so its moment is seen, and otherwise on the
   default page. The first such sticker in book order decides. */
export const openingTab = (stickers, justEarned) => {
  const fresh =
    justEarned instanceof Set ? justEarned : new Set(justEarned || []);
  const hit = (Array.isArray(stickers) ? stickers : []).find(
    (sticker) => sticker && fresh.has(sticker.id),
  );
  return hit ? hit.type : defaultTab(stickers);
};

/* The milestone numbers, with no JSX: the level (0 nothing, 1 pack earned,
   2 complete, 3 Completionist), the activity count that counts toward it
   (zero without an address, the same gate progressLevel applies), the
   API's completion and Completionist thresholds, and the address flag. */
export const milestoneState = (experience) => {
  const level = progressLevel(experience);
  const addressValidated = Boolean(experience && experience.addressValidated);
  const done = addressValidated
    ? completedCount(mergeActivities(experience.activities))
    : 0;
  const { complete, completionist } = thresholdsOf(experience);
  return { level, done, complete, completionist, addressValidated };
};

/* The rewards band's numbers (components/RewardsBand). `pack` is Milestone 1 as three requirements;
   `completion` is Milestone 2 as a meter of `target` pips, the completion
   threshold plus the two required stickers, filled with the earned
   stickers in book order; `completionist` is Milestone 3 the same way,
   with the Completionist threshold, and `shown` only once the first two
   are earned, since the card is for people already complete.
   `activityStickers` is the activity count with no address gate, so the
   page can say "an activity sticker is in the book, add an address"
   rather than pretend nothing was earned. */
export const rewardsState = (experience, stickers) => {
  const { level, done, complete, completionist, addressValidated } =
    milestoneState(experience);
  const all = Array.isArray(stickers) ? stickers : [];
  const activityStickers = all.filter(
    (sticker) => sticker.type !== REQUIRED_TAB && sticker.completed,
  ).length;
  const earned = all.filter((sticker) => sticker.completed);
  const target = complete + REQUIRED_STICKERS.length;
  const pips = earned.slice(0, target);
  const completionistTarget = completionist + REQUIRED_STICKERS.length;
  /* When each milestone was reached, from the stickers' own dates: the
     pack on the day its last requirement landed, the others on the day
     the book reached their count. Null where a date is missing, and the
     card then says Earned without one. */
  const dated = earned
    .map((sticker) => sticker.completedAt)
    .filter(Boolean)
    .sort();
  const reachedAt = (count) =>
    count > 0 && dated.length >= count ? dated[count - 1] : null;
  const firstActivityAt = all
    .filter((sticker) => sticker.type !== REQUIRED_TAB && sticker.completedAt)
    .map((sticker) => sticker.completedAt)
    .sort()[0];
  const packDates = [
    ...all
      .filter((sticker) => sticker.type === REQUIRED_TAB)
      .map((sticker) => sticker.completedAt),
    firstActivityAt,
  ];
  const packAt = packDates.every(Boolean) ? packDates.sort().at(-1) : null;
  return {
    level,
    complete,
    completionist,
    addressValidated,
    activityStickers,
    pack: {
      earned: level >= 1,
      earnedAt: level >= 1 ? packAt : null,
      /* The sticker pip follows the ungated count, as the card's line
         does: a sticker in the book is in the book, address or not. */
      needs: {
        signedIn: true,
        address: addressValidated,
        activity: activityStickers >= 1,
      },
      count: 1 + (addressValidated ? 1 : 0) + (activityStickers >= 1 ? 1 : 0),
      total: 3,
    },
    completion: {
      earned: level >= 2,
      earnedAt: level >= 2 ? reachedAt(target) : null,
      pips,
      target,
      /* In the book's units, as the meter and the copy count: stickers
         in the book still to come, the required two included. */
      remaining: Math.max(0, target - pips.length),
    },
    completionist: {
      shown: level >= 2,
      earned: level >= 3,
      earnedAt: level >= 3 ? reachedAt(completionistTarget) : null,
      pips: earned.slice(0, completionistTarget),
      target: completionistTarget,
      remaining: Math.max(
        0,
        completionistTarget - earned.slice(0, completionistTarget).length,
      ),
    },
    earnedRewards:
      (level >= 1 ? 1 : 0) + (level >= 2 ? 1 : 0) + (level >= 3 ? 1 : 0),
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
