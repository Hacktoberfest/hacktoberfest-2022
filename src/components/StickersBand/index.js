import { my } from 'data/content.mjs';

import Milestones, { milestoneState } from 'components/Milestones';

import styles from './StickersBand.module.css';

/* The hub's qualification band: heading, an intro that changes with the
   level, and the milestone card. The card lives in components/Milestones
   with its pure half, milestoneState, which is read here too. */
const StickersBand = ({ experience }) => {
  const { level, complete } = milestoneState(experience);
  const intro = [
    my.stickers.intro.pending(complete),
    my.stickers.intro.stickersEarned(complete),
    my.stickers.intro.complete,
  ][level];

  return (
    <section className={styles.band} aria-labelledby="stickers-heading">
      <h2 id="stickers-heading" className={styles.heading}>
        {my.stickers.heading.lead} <em>{my.stickers.heading.accent}</em>
      </h2>
      <p className={styles.intro}>{intro}</p>
      <Milestones experience={experience} />
      <p className={styles.intro}>
        <a href="/activities/">{my.stickers.detailCta}</a>
      </p>
    </section>
  );
};

export default StickersBand;
