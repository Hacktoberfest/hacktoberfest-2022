import { useState } from 'react';

import { my } from 'data/content.mjs';
import { MLH_ADDRESS_URL } from 'data/links';
import {
  completedCount,
  mergeActivities,
  progressLevel,
  thresholdsOf,
} from 'lib/eligibility.mjs';

import MilestoneGroup from './MilestoneGroup';
import styles from './StickersBand.module.css';

/* All qualification UI lives here: one card, two collapsible milestone
   sections split by a rule. Each section owns its own three-row checklist;
   rows repeat signed-in and address across both sections on purpose (see
   MilestoneGroup) — the CTA to validate an address appears only once, on
   the first section's row, since a second "Validate" button on one screen
   would be confusing rather than helpful.

   Open/closed defaults hand focus forward as progress is made: Milestone 2
   starts collapsed until Milestone 1 is earned, and Milestone 1 collapses
   once it is — there's nothing left to check there, so the card's
   attention moves to whichever milestone is still open. Both stay
   independently toggleable after that; a user closing or reopening either
   one doesn't affect the other.

   Everything is derived at render from the experience payload — nothing is
   stored, so it cannot drift from the rules in lib/eligibility. Milestone 2
   is a purely additional display tier: progressLevel never changes what
   `isEligible` (the sticker-mailing rule) returns. */
const StickersBand = ({ experience }) => {
  const level = progressLevel(experience);
  const addressValidated = Boolean(experience.addressValidated);
  const done = addressValidated
    ? completedCount(mergeActivities(experience.activities))
    : 0;

  const { complete } = thresholdsOf(experience);
  const activity1Done = done >= 1;
  const activity3Done = done >= complete;

  /* Built here, not at module scope, so the intro copy can carry the
     experience's own complete threshold rather than always saying "3". */
  const INTRO_BY_LEVEL = [
    my.stickers.intro.pending(complete),
    my.stickers.intro.stickersEarned(complete),
    my.stickers.intro.complete,
  ];

  /* Milestone 1's own counter: its three rows are signed-in (always
     done on this page), address, and the any-1-activity requirement —
     not to be confused with `done`/`doneClamped` above, which count raw
     activities toward Milestone 2's threshold. */
  const stickersStepsDone =
    1 + (addressValidated ? 1 : 0) + (activity1Done ? 1 : 0);

  /* Seeded once at mount from the progress this page loaded with. A fresh
     fetch (retry, or a later scenario switch) unmounts and remounts this
     component rather than updating in place, so the default is never
     stale — see my.js, which only renders this band while state==='ready'. */
  const [openStickers, setOpenStickers] = useState(() => level < 1);
  const [openComplete, setOpenComplete] = useState(() => level >= 1);

  const stickersGroup = {
    id: 'stickers',
    tag: my.stickers.groups.stickers.tag,
    description: my.stickers.groups.stickers.description,
    reached: level >= 1,
    accent: 'accentOchre',
    badge:
      level >= 1
        ? my.stickers.groups.stickers.reachedBadge
        : my.stickers.groups.stickers.pendingBadge(stickersStepsDone, 3),
    open: openStickers,
    onToggle: (event) => setOpenStickers(event.target.open),
    rows: [
      {
        key: 'signed-in',
        done: true,
        title: my.stickers.steps.signedIn.title,
        detail: my.stickers.steps.signedIn.detail,
      },
      {
        key: 'address',
        done: addressValidated,
        title: addressValidated
          ? my.stickers.steps.address.done
          : my.stickers.steps.address.title,
        detail: my.stickers.steps.address.detail,
        cta: addressValidated ? null : my.stickers.steps.address.cta,
        href: MLH_ADDRESS_URL,
      },
      {
        key: 'activity',
        done: activity1Done,
        title: activity1Done
          ? my.stickers.steps.activity1.done
          : my.stickers.steps.activity1.title,
        detail: my.stickers.steps.activity1.detail,
      },
    ],
  };

  const completeGroup = {
    id: 'complete',
    tag: my.stickers.groups.complete.tag,
    description: my.stickers.groups.complete.description,
    reached: level >= 2,
    accent: 'accentForest',
    /* Milestone 2 has exactly one requirement — "complete 3 activities" —
       not three the way Milestone 1 does, so its badge counts requirements
       met (0 or 1 of 1), not raw activities. The live activity count still
       lives in the row itself, below. */
    badge:
      level >= 2
        ? my.stickers.groups.complete.reachedBadge
        : my.stickers.groups.complete.pendingBadge(activity3Done ? 1 : 0, 1),
    open: openComplete,
    onToggle: (event) => setOpenComplete(event.target.open),
    /* Signed-in and address don't repeat here — they're the same two
       conditions already shown in the Milestone 1 section above, and
       Milestone 2 can only ever be reached once Milestone 1 already is
       (progressLevel gates both on the same address check). This group's
       own row is the only thing that distinguishes it. */
    rows: [
      {
        key: 'activity',
        done: activity3Done,
        title: activity3Done
          ? my.stickers.steps.activity3.done(complete)
          : my.stickers.steps.activity3.title(complete),
        detail: my.stickers.steps.activity3.detail(complete),
      },
    ],
  };

  return (
    <section className={styles.band} aria-labelledby="stickers-heading">
      <h2 id="stickers-heading" className={styles.heading}>
        {my.stickers.heading.lead} <em>{my.stickers.heading.accent}</em>
      </h2>
      <p className={styles.intro}>{INTRO_BY_LEVEL[level]}</p>

      <div className={styles.card}>
        <MilestoneGroup {...stickersGroup} />
        <MilestoneGroup {...completeGroup} />
      </div>
    </section>
  );
};

export default StickersBand;
