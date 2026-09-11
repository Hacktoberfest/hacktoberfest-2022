import { ART } from 'components/ActivityCard/stickerArt';
import { my } from 'data/content.mjs';
import { MLH_ADDRESS_URL } from 'data/links';
import { MILESTONE_IDS } from 'lib/justEarned.mjs';
import { bookStickers, rewardsState } from 'lib/stickerBook.mjs';

import styles from './RewardsBand.module.css';

/* The rewards band, above the sticker book: the milestones as more
   stickers, earned by earning stickers, each a card; the third card,
   Completionist, only once the first two are earned. The pack card
   lists its three requirements as pips, each filled with the sticker that
   met it, with the address button while the address is missing; the
   completion card is a meter of pips, one per sticker toward the target,
   filled with the stickers already earned in book order, so both rows
   read as the book filling up. An earned reward
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

const completionistWhy = (rewards) => {
  const { why } = my.rewards.completionist;
  if (rewards.completionist.earned) return why.earned;
  return why.remaining(rewards.completionist.remaining);
};

/* A meter of pips: the earned stickers in book order in their own
   grounds, then dashed empty slots up to the target. Decorative; the
   label under it says the count. */
const Meter = ({ pips, target }) => (
  <div className={styles.meter} aria-hidden="true">
    {Array.from({ length: target }, (_, index) => pips[index] || null).map(
      (sticker, index) =>
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
);

/* One requirement of the pack, as a pip: the sticker that meets it, in
   its own ground, once it is in the book, and a dashed empty slot until
   then, so the row reads as the holographic card's meter does. The label
   says the requirement; the pip is decorative. */
const Need = ({ label, sticker }) => (
  <li className={styles.need}>
    <span
      className={
        sticker
          ? `${styles.pip} ${styles.pipOn} ${styles[`ground_${sticker.type}`] || ''}`
          : styles.pip
      }
      aria-hidden="true"
    >
      {sticker ? ART[sticker.art] || null : null}
    </span>
    {label}
  </li>
);

const RewardsBand = ({ experience, justEarned }) => {
  const stickers = bookStickers(experience, { addressHref: MLH_ADDRESS_URL });
  const rewards = rewardsState(experience, stickers);
  /* A milestone reached since the participant last looked
     (lib/justEarned.mjs) gets its moment: the card is marked and the
     stylesheet does the rest. */
  const fresh = (id) => (justEarned && justEarned.has(id) ? 'true' : undefined);
  const { pack, complete, completionist } = my.rewards;
  const intro = [
    my.rewards.intro.pending(rewards.complete),
    my.rewards.intro.stickersEarned(rewards.complete),
    my.rewards.intro.complete,
    my.rewards.intro.completionist,
  ][rewards.level];
  /* The pack's pips: the two required stickers by id, and the first
     activity sticker in the book, whichever it was. rewardsState says
     whether each requirement is met; these say which sticker to draw. */
  const bySlug = Object.fromEntries(
    stickers.map((sticker) => [sticker.id, sticker]),
  );
  const firstActivity =
    stickers.find(
      (sticker) => sticker.type !== 'required' && sticker.completed,
    ) || null;

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
          data-just-earned={fresh(MILESTONE_IDS.pack)}
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
                className={`${styles.badge} ${rewards.pack.earned ? styles.badgeEarned : ''}`}
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
                sticker={rewards.pack.needs.signedIn ? bySlug.signin : null}
              />
              <Need
                label={pack.needs.address}
                sticker={rewards.pack.needs.address ? bySlug.address : null}
              />
              <Need
                label={pack.needs.activity}
                sticker={rewards.pack.needs.activity ? firstActivity : null}
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
          data-just-earned={fresh(MILESTONE_IDS.complete)}
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
                className={`${styles.badge} ${rewards.completion.earned ? styles.badgeEarned : ''}`}
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
            <Meter
              pips={rewards.completion.pips}
              target={rewards.completion.target}
            />
            <p className={styles.meterLabel}>
              {complete.meterLabel(
                rewards.completion.pips.length,
                rewards.completion.target,
              )}
            </p>
          </div>
        </li>
        {/* Milestone 3, for people already complete: the card only exists
           once the first two are earned (rewardsState.completionist.shown),
           and takes the whole row under them, since its meter is the
           longest in the band. */}
        {rewards.completionist.shown && (
          <li
            className={`${styles.card} ${styles.cardWide}`}
            data-earned={rewards.completionist.earned ? 'true' : undefined}
            data-just-earned={fresh(MILESTONE_IDS.completionist)}
          >
            <div className={styles.slot}>
              <div
                className={`${styles.sticker} ${styles.groundCompletionist}`}
              >
                {ART.trophy}
              </div>
              {rewards.completionist.earned && (
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
                <span className={styles.tag}>{completionist.tag}</span>
                <span
                  className={`${styles.badge} ${rewards.completionist.earned ? styles.badgeEarned : ''}`}
                >
                  {rewards.completionist.earned
                    ? completionist.reachedBadge
                    : completionist.pendingBadge(
                        rewards.completionist.pips.length,
                        rewards.completionist.target,
                      )}
                </span>
              </div>
              <h3 className={styles.title}>{completionist.title}</h3>
              <p className={styles.why}>{completionistWhy(rewards)}</p>
              <Meter
                pips={rewards.completionist.pips}
                target={rewards.completionist.target}
              />
              <p className={styles.meterLabel}>
                {completionist.meterLabel(
                  rewards.completionist.pips.length,
                  rewards.completionist.target,
                )}
              </p>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
};

export default RewardsBand;
