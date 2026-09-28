import { activitiesPage, my } from 'data/content.mjs';
import { startDigitalOceanConnect } from 'lib/digitalocean.mjs';
import { formatEarnedDate } from 'lib/earnedDate.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import styles from './Album.module.css';

/* One sticker as a cell on a page of the book: the sticker in its die-cut
   slot, centred, its name under it, and one line of status. Earned, the
   sticker peels off the slot, leaning its own way (Album.module.css), with
   a tick on its corner that is the one thing that says "earned" for
   assistive tech; the line under the name says when (never earlier than October 1,
   lib/earnedDate.mjs), or where it came from for a sticker with no date. Not yet, the sticker is a grey
   silhouette and the line is the way to earn it, or "Not yet" for a
   sticker with no destination.

   The cell says less than the activity card (components/ActivityCard),
   deliberately: the page is the type, so no type chip; the detail and
   the source live on /activities/, a link away. The sticker is the point
   here. */
const StickerCell = ({ sticker, justEarned = false, onShare }) => {
  const earned = Boolean(sticker.completed);
  const external = /^https?:\/\//.test(sticker.href || '');
  const date = sticker.completedAt
    ? formatEarnedDate(sticker.completedAt)
    : null;
  const how = sticker.source
    ? activitiesPage.list.source[sticker.source]
    : null;

  return (
    <li
      className={styles.cell}
      data-earned={earned ? 'true' : undefined}
      data-just-earned={earned && justEarned ? 'true' : undefined}
    >
      {sticker.type === 'required' && (
        <span className={styles.cellTag}>{my.album.cell.required}</span>
      )}
      <div className={styles.slot}>
        <div className={styles.sticker}>
          <img
            className={styles.stickerImage}
            src={stickerImageSrc(sticker.id)}
            alt=""
            draggable="false"
          />
        </div>
        {earned && (
          <span
            className={styles.tick}
            role="img"
            aria-label={my.album.cell.earned}
          >
            ✓
          </span>
        )}
        {/* Locked: a padlock where the tick will be, until the DEV
            account is linked (lib/stickerBook.mjs `locked`). */}
        {!earned && sticker.locked && (
          <span
            className={styles.lock}
            role="img"
            aria-label={my.album.cell.locked}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3v-3a5 5 0 0 1 5 -5m0 12a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m0 -10a3 3 0 0 0 -3 3v3h6v-3a3 3 0 0 0 -3 -3" />
            </svg>
          </span>
        )}
      </div>
      {/* The book's own short name where the page heading already says
          the rest (eligibility.mjs cellLabel); the full label everywhere
          else, so a shared sticker still says what it is. */}
      <h4 className={styles.cellTitle}>{sticker.cellLabel || sticker.label}</h4>
      {/* A challenge that runs for a set of days says which, until it is
          earned (eligibility.mjs `when`): the DEV weeks. */}
      {!earned && sticker.when && (
        <p className={styles.cellWhen}>{sticker.when}</p>
      )}
      {earned ? (
        <>
          <p className={styles.cellDone}>
            {date || (how ? how.charAt(0).toUpperCase() + how.slice(1) : '')}
          </p>
          {/* The share opens the modal on the sticker itself
              (components/ShareModal); the book's own share is in the
              spine. A cell only offers it once the sticker is earned,
              since there is nothing to show otherwise. */}
          {onShare && (
            <button
              type="button"
              className={`${styles.cellLink} ${styles.cellButton}`}
              onClick={() => onShare(sticker)}
            >
              {my.share.stickerCta}
            </button>
          )}
        </>
      ) : sticker.locked ? (
        <p className={styles.cellLocked}>{my.album.cell.lockedLine}</p>
      ) : sticker.action === 'digitalocean' ? (
        <button
          type="button"
          className={`${styles.cellLink} ${styles.cellButton}`}
          onClick={() => startDigitalOceanConnect()}
        >
          {sticker.ctaLabel}
        </button>
      ) : sticker.href ? (
        <a
          className={styles.cellLink}
          href={sticker.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {sticker.ctaLabel}
        </a>
      ) : (
        <p className={styles.cellStatus}>{my.album.cell.notYet}</p>
      )}
    </li>
  );
};

export default StickerCell;
