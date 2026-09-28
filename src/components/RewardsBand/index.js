import { my } from 'data/content.mjs';
import { MLH_ADDRESS_URL } from 'data/links';
import { MILESTONE_IDS } from 'lib/justEarned.mjs';
import { bookStickers, rewardsState } from 'lib/stickerBook.mjs';
import { useState } from 'react';

import ShareModal from 'components/ShareModal';
import { formatEarnedDate } from 'lib/earnedDate.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

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
  return rewards.pack.earned ? why.earned : why.pending;
};

const completeWhy = (rewards) => {
  const { why } = my.rewards.complete;
  return rewards.completion.earned ? why.earned : why.pending;
};

const completionistWhy = (rewards) => {
  const { why } = my.rewards.completionist;
  if (rewards.completionist.earned) return why.earned;
  return why.remaining(rewards.completionist.remaining);
};

/* A meter of pips: the earned stickers in book order, each its own
   picture, then dashed empty slots up to the target. Decorative; the
   label under it says the count. */
const Meter = ({ pips, target }) => (
  <div className={styles.meter} aria-hidden="true">
    {Array.from({ length: target }, (_, index) => pips[index] || null).map(
      (sticker, index) =>
        sticker ? (
          <span key={sticker.id} className={`${styles.pip} ${styles.pipOn}`}>
            <img src={stickerImageSrc(sticker.id)} alt="" draggable="false" />
          </span>
        ) : (
          <span key={`empty-${index}`} className={styles.pip} />
        ),
    )}
  </div>
);

/* One requirement of the pack, as a pip: the sticker that meets it once
   it is in the book, and a dashed empty slot until then, so the row reads
   as the holographic card's meter does. The label says the requirement;
   the pip is decorative. */
const Need = ({ label, sticker }) => (
  <li className={styles.need}>
    <span
      className={sticker ? `${styles.pip} ${styles.pipOn}` : styles.pip}
      aria-hidden="true"
    >
      {sticker ? (
        <img src={stickerImageSrc(sticker.id)} alt="" draggable="false" />
      ) : null}
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
  /* Once the Completionist card is on the page the first two are done
     with: they share one row above it and drop their requirements and
     meter, keeping the sticker at full size and their one line, so the
     three cards read as a set whatever their state. */
  const compact = rewards.completionist.shown;
  const cardClass = `${styles.card} ${compact ? styles.cardCompact : ''}`;
  const { pack, complete, completionist } = my.rewards;
  /* The badge on an earned card: the day it was reached when the
     stickers' dates say, else the plain word. */
  const earnedBadge = (state, words) =>
    state.earnedAt
      ? my.rewards.earnedOn(formatEarnedDate(state.earnedAt))
      : words.reachedBadge;
  /* The line under the heading says what milestones are; the level's
     own sentence is the hero's status line (pages/my.js heroStatus). */
  /* A milestone shares the way a sticker does: its own picture, its
     title as the label, through the book's modal. */
  const [share, setShare] = useState(null);
  const shareButton = (id, words) => (
    <button
      type="button"
      className={styles.share}
      onClick={() =>
        setShare({
          kind: 'sticker',
          sticker: { id, label: words.title },
          text: words.shareText,
        })
      }
    >
      {my.share.stickerCta}
    </button>
  );
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
      <p className={styles.intro}>{my.rewards.lede}</p>
      <ul className={`${styles.cards} ${compact ? styles.cardsCompact : ''}`}>
        <li
          className={cardClass}
          data-earned={rewards.pack.earned ? 'true' : undefined}
          data-just-earned={fresh(MILESTONE_IDS.pack)}
        >
          <div className={styles.slot}>
            <div className={styles.sticker}>
              <img
                className={styles.stickerImage}
                src={stickerImageSrc('milestone-pack')}
                alt=""
                draggable="false"
              />
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
                  ? earnedBadge(rewards.pack, pack)
                  : pack.pendingBadge(rewards.pack.count, rewards.pack.total)}
              </span>
            </div>
            <h3 className={styles.title}>{pack.title}</h3>
            <p className={styles.why}>{packWhy(rewards)}</p>
            {rewards.pack.earned && shareButton('milestone-pack', pack)}
            {!compact && !rewards.pack.earned && (
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
            )}
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
          className={cardClass}
          data-earned={rewards.completion.earned ? 'true' : undefined}
          data-just-earned={fresh(MILESTONE_IDS.complete)}
        >
          <div className={styles.slot}>
            <div className={styles.sticker}>
              <img
                className={styles.stickerImage}
                src={stickerImageSrc('milestone-complete')}
                alt=""
                draggable="false"
              />
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
                  ? earnedBadge(rewards.completion, complete)
                  : complete.pendingBadge(
                      rewards.completion.pips.length,
                      rewards.completion.target,
                    )}
              </span>
            </div>
            <h3 className={styles.title}>{complete.title}</h3>
            <p className={styles.why}>{completeWhy(rewards)}</p>
            {rewards.completion.earned &&
              shareButton('milestone-complete', complete)}
            {!compact && !rewards.completion.earned && (
              <Meter
                pips={rewards.completion.pips}
                target={rewards.completion.target}
              />
            )}
            {!compact && !rewards.completion.earned && (
              <p className={styles.meterLabel}>
                {complete.meterLabel(
                  rewards.completion.pips.length,
                  rewards.completion.target,
                )}
              </p>
            )}
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
              <div className={styles.sticker}>
                <img
                  className={styles.stickerImage}
                  src={stickerImageSrc('milestone-completionist')}
                  alt=""
                  draggable="false"
                />
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
                    ? earnedBadge(rewards.completionist, completionist)
                    : completionist.pendingBadge(
                        rewards.completionist.pips.length,
                        rewards.completionist.target,
                      )}
                </span>
              </div>
              <h3 className={styles.title}>{completionist.title}</h3>
              <p className={styles.why}>{completionistWhy(rewards)}</p>
              {/* The meter fills, then goes: earned, the card says the day
                  and where the certificate is, not seventeen full pips. */}
              {rewards.completionist.earned &&
                shareButton('milestone-completionist', completionist)}
              {!rewards.completionist.earned && (
                <>
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
                </>
              )}
            </div>
          </li>
        )}
      </ul>
      <ShareModal
        share={share}
        experience={experience}
        onClose={() => setShare(null)}
      />
    </section>
  );
};

export default RewardsBand;
