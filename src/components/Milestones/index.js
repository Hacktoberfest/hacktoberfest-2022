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
import styles from './Milestones.module.css';

/* The numbers both pages read. Pure so /activities/ can print "N of M"
   without rendering the card. */
export const milestoneState = (experience) => {
  const level = progressLevel(experience);
  const addressValidated = Boolean(experience && experience.addressValidated);
  const done = addressValidated
    ? completedCount(mergeActivities(experience.activities))
    : 0;
  const { complete } = thresholdsOf(experience);
  return { level, done, complete, addressValidated };
};

/* The one card with two collapsible milestone sections, split by a rule.
   Lifted out of StickersBand so /my and /activities/ render the same
   thing; the band keeps its heading and intro, this keeps the card.

   Open/closed defaults hand focus forward as progress is made: Milestone 2
   starts collapsed until Milestone 1 is earned, and Milestone 1 collapses
   once it is. Seeded once at mount; a fresh fetch remounts. */
const Milestones = ({ experience }) => {
  const { level, done, complete, addressValidated } =
    milestoneState(experience);
  const activity1Done = done >= 1;
  const activity3Done = done >= complete;
  const stickersStepsDone =
    1 + (addressValidated ? 1 : 0) + (activity1Done ? 1 : 0);

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
    badge:
      level >= 2
        ? my.stickers.groups.complete.reachedBadge
        : my.stickers.groups.complete.pendingBadge(activity3Done ? 1 : 0, 1),
    open: openComplete,
    onToggle: (event) => setOpenComplete(event.target.open),
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
    <div className={styles.card}>
      <MilestoneGroup {...stickersGroup} />
      <MilestoneGroup {...completeGroup} />
    </div>
  );
};

export default Milestones;
