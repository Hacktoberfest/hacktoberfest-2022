import { ART } from 'components/ActivityCard/stickerArt';
import { my } from 'data/content.mjs';
import { MLH_ADDRESS_URL } from 'data/links';
import { bookStickers, rewardsState } from 'lib/stickerBook.mjs';

import styles from './RewardsBand.module.css';

/* The rewards band, above the sticker book: the two milestones as two
   more stickers, earned by earning stickers, each a card. The pack card
   lists its three requirements as ticks, with the address button while
   the address is missing; the completion card is a meter of pips, one per
   sticker toward the target, filled with the stickers already earned in
   book order, so the meter reads as the book filling up. An earned reward
   peels with a tick on its corner; one not yet earned is a grey
   silhouette in its slot, as the book's stickers are.

   The intro changes with the level, the way the old progress band's did.
   The numbers are lib/stickerBook.mjs' rewardsState; this file only draws
   them. */
const packWhy = (rewards) => {
  const { why } = my.rewards.pack;
  if (rewards.pack.earned) return why.earned;
  if (!rewards.addressValidated && rewards.activityStickers > 0) {
    return why.addressAfter;
  }
  if (!rewards.addressValidated) return why.addressFirst;
  return why.activity;
};

const completeWhy = (rewards) => {
  const { why } = my.rewards.complete;
  if (rewards.completion.earned) return why.earned;
  if (rewards.level < 1) return why.locked(rewards.complete);
  return why.remaining(rewards.completion.remaining);
};

const Need = ({ label, done }) => (
  <li className={styles.need}>
    <span
      className={`${styles.tick} ${done ? styles.tickOn : ''}`}
      aria-hidden="true"
    >
      {done ? '✓' : ''}
    </span>
    {label}
  </li>
);

const RewardsBand = ({ experience }) => {
  const stickers = bookStickers(experience, { addressHref: MLH_ADDRESS_URL });
  const rewards = rewardsState(experience, stickers);
  const { pack, complete } = my.rewards;
  const intro = [
    my.rewards.intro.pending(rewards.complete),
    my.rewards.intro.stickersEarned(rewards.complete),
    my.rewards.intro.complete,
  ][rewards.level];
  const pips = Array.from(
    { length: rewards.completion.target },
    (_, index) => rewards.completion.pips[index] || null,
  );

  return (
    <section className={styles.band} aria-labelledby="rewards-heading">
      <h2 id="rewards-heading" className={styles.heading}>
        {my.rewards.heading.lead} <em>{my.rewards.heading.accent}</em>
      </h2>
      <p className={styles.intro}>{intro}</p>
      <ul className={styles.cards}>
        <li
          className={styles.card}
          data-earned={rewards.pack.earned ? 'true' : undefined}
        >
          <div className={styles.slot}>
            <div className={`${styles.sticker} ${styles.groundPack}`}>
              {ART.parcel}
            </div>
            {rewards.pack.earned && (
              <span
                className={styles.tick}
                role="img"
                aria-label={my.album.cell.earned}
              >
                ✓
              </span>
            )}
          </div>
          <div className={styles.body}>
            <div className={styles.top}>
              <span className={styles.tag}>{pack.tag}</span>
              <span
                className={`${styles.badge} ${rewards.pack.earned ? styles.badgeOchre : ''}`}
              >
                {rewards.pack.earned
                  ? pack.reachedBadge
                  : pack.pendingBadge(rewards.pack.count, rewards.pack.total)}
              </span>
            </div>
            <h3 className={styles.title}>{pack.title}</h3>
            <p className={styles.why}>{packWhy(rewards)}</p>
            <ul className={styles.needs}>
              <Need
                label={pack.needs.signedIn}
                done={rewards.pack.needs.signedIn}
              />
              <Need
                label={pack.needs.address}
                done={rewards.pack.needs.address}
              />
              <Need
                label={pack.needs.activity}
                done={rewards.pack.needs.activity}
              />
            </ul>
            {!rewards.addressValidated && (
              <a
                className={`hf-button hf-button--small ${styles.cta}`}
                href={MLH_ADDRESS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pack.addressCta}
              </a>
            )}
          </div>
        </li>
        <li
          className={styles.card}
          data-earned={rewards.completion.earned ? 'true' : undefined}
        >
          <div className={styles.slot}>
            <div className={`${styles.sticker} ${styles.groundComplete}`}>
              {ART.star}
            </div>
            {rewards.completion.earned && (
              <span
                className={styles.tick}
                role="img"
                aria-label={my.album.cell.earned}
              >
                ✓
              </span>
            )}
          </div>
          <div className={styles.body}>
            <div className={styles.top}>
              <span className={styles.tag}>{complete.tag}</span>
              <span
                className={`${styles.badge} ${rewards.completion.earned ? styles.badgeDeep : ''}`}
              >
                {rewards.completion.earned
                  ? complete.reachedBadge
                  : complete.pendingBadge(
                      rewards.completion.pips.length,
                      rewards.completion.target,
                    )}
              </span>
            </div>
            <h3 className={styles.title}>{complete.title}</h3>
            <p className={styles.why}>{completeWhy(rewards)}</p>
            {/* The pips are decorative: the label under them says the count. */}
            <div className={styles.meter} aria-hidden="true">
              {pips.map((sticker, index) =>
                sticker ? (
                  <span
                    key={sticker.id}
                    className={`${styles.pip} ${styles.pipOn} ${styles[`ground_${sticker.type}`] || ''}`}
                  >
                    {ART[sticker.art] || null}
                  </span>
                ) : (
                  <span key={`empty-${index}`} className={styles.pip} />
                ),
              )}
            </div>
            <p className={styles.meterLabel}>
              {complete.meterLabel(
                rewards.completion.pips.length,
                rewards.completion.target,
              )}
            </p>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default RewardsBand;
