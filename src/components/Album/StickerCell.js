import { ART } from 'components/ActivityCard/stickerArt';
import { activitiesPage, my } from 'data/content.mjs';

import styles from './Album.module.css';

/* One sticker as a cell on a page of the book: the sticker in its die-cut
   slot, centred, its name under it, and one line of status. Earned, the
   sticker peels off the slot, leaning its own way (Album.module.css), with
   a tick on its corner that is the one thing that says "earned" for
   assistive tech; the line under the name says when, or where it came
   from for a sticker with no date. Not yet, the sticker is a grey
   silhouette and the line is the way to earn it, or "Not yet" for a
   sticker with no destination.

   The cell says less than the activity card (components/ActivityCard),
   deliberately: the page is the type, so no type chip; the detail and
   the source live on /activities/, a link away. The sticker is the point
   here. */
const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

const StickerCell = ({ sticker }) => {
  const earned = Boolean(sticker.completed);
  const external = /^https?:\/\//.test(sticker.href || '');
  const date = sticker.completedAt ? formatDate(sticker.completedAt) : null;
  const how = sticker.source
    ? activitiesPage.list.source[sticker.source]
    : null;
  const ground = styles[`ground_${sticker.type}`] || '';

  return (
    <li className={styles.cell} data-earned={earned ? 'true' : undefined}>
      {sticker.type === 'required' && (
        <span className={styles.cellTag}>{my.album.cell.required}</span>
      )}
      <div className={styles.slot}>
        <div className={`${styles.sticker} ${ground}`}>
          {ART[sticker.art] || null}
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
      </div>
      <h4 className={styles.cellTitle}>{sticker.label}</h4>
      {earned ? (
        <p className={styles.cellDone}>
          {date || (how ? how.charAt(0).toUpperCase() + how.slice(1) : '')}
        </p>
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
